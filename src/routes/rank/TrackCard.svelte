<script lang="ts">
    import type { TrackModel } from "$lib/models";
    import type { TrackManager } from "$lib/trackManager";

    export let globalTrackManager: TrackManager;
    export let props: TrackModel;

    const currentTrackStore = globalTrackManager.currentTrackStore;

    const handlePlayToggle = async (track: TrackModel) => {
        globalTrackManager.toggleTrackPlayback(track);
    }

    // on:dragstart={(e) => globalTrackManager.handleDragStart(e, props.id)}
    // on:dragover={(e) => globalTrackManager.handleDragOver(e)}
    // on:dragend={(e) => globalTrackManager.handleDragEnd(e)}
    // on:drop={(e) => globalTrackManager.handleDrop(e, props.id)}
</script>

<li draggable="true" class="list-none">
    <div class="w-full max-h-10 grid grid-cols-5 items-center py-1 pl-2 pr-3 text-left rounded-sm bg-stone-200 text-stone-800
        {props.isDragging ? 'cursor-grabbing' : 'cursor-grab'}"
        >
        <div class="col-span-4 flex flex-row items-center space-x-2 pr-2">
            <img src={props.coverArtUrl} alt="" class="h-8 rounded-sm"/>
            <div class="subgrid grid-rows-2">
                <span class="font-semibold text-xs line-clamp-1">{props.name}</span>
                <span class="text-xxs line-clamp-1">{props.artistNames?.at(0)}</span>
            </div>
        </div>
        <div class="col-span-1 flex flex-row items-center w-full justify-end space-x-2">
            <button on:click={() => handlePlayToggle(props)} on:keydown={(e) => {if(e.keyCode === 32) e.preventDefault()}}
                class="flex flex-row items-center text-2xl"
                >
                {#if props.id === $currentTrackStore?.id}
                    <i class="fa-solid fa-circle-stop hover:text-stone-600"></i>
                {:else}
                    <i class="fa-solid fa-circle-play hover:text-purple-700"></i>
                {/if}
            </button>
        </div>
    </div>
</li>

<style>
    .text-xxs {
        font-size: 0.6rem;
        line-height: 0.75rem;
    }
</style>