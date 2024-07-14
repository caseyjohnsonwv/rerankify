<script lang="ts">
    import type { TrackModel } from "$lib/models";
    import { globalDraggingManager, TriggerableElements } from "$lib/draggingManager";
    import { globalTrackManager } from "$lib/trackManager";
    import { writable } from "svelte/store";

    export let props: TrackModel;

    const isDraggingStore = writable<boolean>(false);
    const currentTrackStore = globalTrackManager.currentTrackStore;

    const handlePlayToggle = async (track: TrackModel) => {
        globalTrackManager.toggleTrackPlayback(track);
    }


    let rootElement: HTMLElement;
    globalDraggingManager.triggeredElementStore.subscribe((element) => {
        if (globalDraggingManager.getDraggedElement()?.id === rootElement?.id) {
            switch (element?.id) {
                case (TriggerableElements.TRACK_DISPOSAL_ELEMENT): {
                    globalTrackManager.removeTrackById(props.id);
                    globalDraggingManager.setDraggedElement(undefined);
                    break;
                }
                case (TriggerableElements.NOW_PLAYING_ELEMENT): {
                    if ($currentTrackStore?.id !== props.id) {
                        globalTrackManager.stopPlayback();
                        globalTrackManager.toggleTrackPlayback(props);
                    }
                    globalDraggingManager.setDraggedElement(undefined);
                    break;
                }
            }
        }
    })

    const handleDragStart = async (event: DragEvent) => {
        globalDraggingManager.setDraggedElement(rootElement);
        isDraggingStore.set(true);
    }

    const handleDragOver = async (event: DragEvent) => {
        event.preventDefault();
    }

    const handleDragEnd = async (event: DragEvent) => {
        globalDraggingManager.checkForInteractionTrigger(event);
        globalDraggingManager.setDraggedElement(undefined);
        isDraggingStore.set(false);
    }
</script>

<li draggable="true" id="{props.id}" bind:this={rootElement}
    class="list-none {$isDraggingStore ? 'opacity-60' : 'opacity-100'}"
    on:dragstart={handleDragStart}
    on:dragover={handleDragOver}
    on:dragend={handleDragEnd}
    >
    <div class="w-full max-h-10 grid grid-cols-8 items-center py-1 pl-2 pr-3 text-left rounded-sm bg-stone-200 text-stone-800
        {$isDraggingStore ? 'cursor-grabbing' : 'cursor-grab'}"
        >
        <div class="col-span-7 flex flex-row items-center space-x-2 pr-2">
            <img src={props.coverArtUrl} alt="" class="h-8 rounded-sm"/>
            <div class="subgrid grid-rows-2">
                <span class="font-semibold text-xs line-clamp-1">{props.name}</span>
                <span class="text-xxs line-clamp-1">{props.artistNames?.at(0)}</span>
            </div>
        </div>
        <div class="col-span-1 flex flex-row items-center w-full justify-center space-x-2">
            <button on:click={() => handlePlayToggle(props)} on:keydown={(e) => {if(e.keyCode === 32) e.preventDefault()}}
                class="flex flex-row items-center text-xl outline-none"
                >
                {#if props.id === $currentTrackStore?.id}
                    <i class="fa-solid fa-circle-stop text-stone-600 animate-pulse"></i>
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