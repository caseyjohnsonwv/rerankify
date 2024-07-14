<script lang="ts">
    import { globalDraggingManager, TriggerableElements } from "$lib/draggingManager";
    import { globalTrackManager } from "$lib/trackManager";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    const isHoveredStore = writable<boolean>(false);
    const isDraggedOverStore = writable<boolean>(false);
    let trackDisposalElement: HTMLElement;

    const handleDoubleClick = async () => {
        globalTrackManager.removeAllTracks();
    }

    onMount(() => {
        trackDisposalElement.addEventListener('mouseenter', () => isHoveredStore.set(true));
        trackDisposalElement.addEventListener('mouseleave', () => isHoveredStore.set(false));
        trackDisposalElement.addEventListener('dragenter', () => isDraggedOverStore.set(true));
        trackDisposalElement.addEventListener('dragover', (e:DragEvent) => {
            e.preventDefault();
            isDraggedOverStore.set(true);
        });
        trackDisposalElement.addEventListener('dragleave', () => isDraggedOverStore.set(false));
        trackDisposalElement.addEventListener('drop', () => isDraggedOverStore.set(false));
        globalDraggingManager.registerElement(trackDisposalElement);
    });
</script>

<button id="{TriggerableElements.TRACK_DISPOSAL_ELEMENT}" bind:this={trackDisposalElement}
    on:dblclick={handleDoubleClick}
    class="flex flex-row justify-center items-center p-2 space-x-3 h-12 rounded-lg text-lg cursor-pointer ring-1 ring-stone-400 outline-none
    {$isHoveredStore || $isDraggedOverStore ? 'bg-stone-300 text-red-500 font-semibold' : 'text-stone-500'}
    ">
    {#if $isHoveredStore}
        <span class="text-xs italic">Double click to delete ALL tracks</span>
    {:else}
        <i class="fa-solid fa-trash"></i>
    {/if}
</button>