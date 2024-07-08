<script lang="ts">
    import type { TrackModel } from "$lib/models";
    import type { TrackManager } from "$lib/trackManager";

    export let globalTrackManager: TrackManager;
    export let trackProps: TrackModel;

    const currentTrackStore = globalTrackManager.currentTrackStore;
    const trackListStore = globalTrackManager.trackListStore;

    $: isAdded = $trackListStore.filter((track) => track.id === trackProps.id).at(0) !== undefined;

    const handlePlayToggle = async (track: TrackModel) => {
        globalTrackManager.toggleTrackPlayback(track);
    }

    const handleTrackManagerAction = async (track: TrackModel) => {
        if (!isAdded) globalTrackManager.addTrack(track);
        else globalTrackManager.removeTrackById(track.id);
    }
</script>

<div class="max-h-14 grid grid-cols-8 items-center my-1 py-1 px-4 border-s-2 text-stone-800 border-stone-500 bg-stone-100 hover:bg-purple-100 hover:cursor-pointer">
    <div class="col-span-4 flex flex-row items-center space-x-2 pr-2">
        <img src={trackProps.coverArtUrl} alt="" class="h-10 rounded-sm"/>
        <div class="subgrid grid-rows-2">
            <span class="font-semibold line-clamp-1">{trackProps.name}</span>
            <span class="text-xs line-clamp-1">{trackProps.artistNames?.at(0)}</span>
        </div>
    </div>
    <button on:click={() => handlePlayToggle(trackProps)} on:keydown={(e) => {if(e.keyCode === 32) e.preventDefault()}}
        class="col-span-3 flex flex-row  justify-center w-full py-3 rounded-lg outline-none space-x-2 items-center
        {trackProps.id === $currentTrackStore?.id ? 'bg-purple-600 hover:bg-purple-500 text-stone-100' : 'bg-stone-200 hover:bg-stone-300'}
        ">
        <span class="text-xs">Preview</span>
        {#if trackProps.id === $currentTrackStore?.id}
            <i class="fa-solid fa-circle-stop"></i>
        {:else}
            <i class="fa-solid fa-circle-play"></i>
        {/if}
    </button>
    <div class="col-span-1 flex flex-row items-center justify-end space-x-2">
        <span class="text-xs">{Math.floor(trackProps.duration / 60) }:{ `${trackProps.duration % 60}`.padStart(2, "0")}</span>
        <button on:click={() => handleTrackManagerAction(trackProps)} class="flex flex-row items-center">
            {#if isAdded}
                <i class="fa-solid fa-circle-check text-xl text-green-600 hover:text-green-800"></i>
            {:else}
                <i class="fa-solid fa-circle-plus text-xl text-purple-700 hover:text-purple-900"></i>
            {/if}
        </button>
    </div>
</div>