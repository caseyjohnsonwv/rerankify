<script lang="ts">
    import type { TrackModel } from "$lib/models";
    import { globalDraggingManager, TriggerableElements } from "$lib/draggingManager";
    import { globalTrackManager } from "$lib/trackManager";
    import { writable } from "svelte/store";
    import { onMount } from "svelte";

    export let props: TrackModel;

    const isDraggingStore = writable<boolean>(false);
    const currentTrackStore = globalTrackManager.currentTrackStore;
    const trackListStore = globalTrackManager.trackListStore;

    const handlePlayToggle = async (track: TrackModel) => {
        globalTrackManager.toggleTrackPlayback(track);
    }

    $: inCanvas = $trackListStore.find((track) => track.id === props.id)?.canvasX !== undefined;

    let rootElement: HTMLElement;
    let dragOffset = {x: 0, y: 0};
    globalDraggingManager.triggeredElementStore.subscribe((element) => {
        if (globalDraggingManager.getDraggedElement()?.id === rootElement?.id) {
            switch (element?.id) {
                case (TriggerableElements.TRACK_DISPOSAL_ELEMENT): {
                    globalTrackManager.removeTrackById(props.id);
                    break;
                }
                case (TriggerableElements.NOW_PLAYING_ELEMENT): {
                    if ($currentTrackStore?.id !== props.id) {
                        globalTrackManager.stopPlayback();
                        globalTrackManager.toggleTrackPlayback(props);
                    }
                    break;
                }
                case (TriggerableElements.CANVAS_ROOT_ELEMENT): {
                    const dragEvent = globalDraggingManager.getDragEvent();
                    if (dragEvent) {
                        const newLocation = globalTrackManager.moveTrackToCanvasLocationById(props.id, dragEvent, dragOffset);
                        setCardPosition(newLocation.x, newLocation.y)
                    }
                    break;
                }
            }
        }
    })

    onMount(() => {
        if (props.canvasX && props.canvasY) {
            setCardPosition(props.canvasX, props.canvasY)
        }
    })

    const setCardPosition = (x: number, y: number) => {
        rootElement.style.position = 'absolute';
        rootElement.style.left = `${x}px`;
        rootElement.style.top = `${y}px`;
    }

    const handleDragStart = async (event: DragEvent) => {
        const rect = rootElement.getBoundingClientRect();
        dragOffset.x = event.clientX - rect.left;
        dragOffset.y = event.clientY - rect.top;
        globalDraggingManager.setDraggedElement(rootElement);
        isDraggingStore.set(true);
    }

    const handleDragOver = async (event: DragEvent) => {
        event.preventDefault();
    }

    const handleDragEnd = async (event: DragEvent) => {
        globalDraggingManager.checkForInteractionTrigger(event);
        isDraggingStore.set(false);
    }
</script>

<li draggable="true" id="{props.id}" bind:this={rootElement}
    class="list-none w-full max-w-72
    {$isDraggingStore ? 'opacity-60' : 'opacity-100'}
    {inCanvas ? 'ring-1 ring-stone-500 absolute' : 'relative'}"
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