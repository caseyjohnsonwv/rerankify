<script lang="ts">
    import { globalDraggingManager } from "$lib/draggingManager";
    import { globalTrackManager } from "$lib/trackManager";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    const isDraggingOverStore = writable<boolean>(false);
    let trackDisposalElement: HTMLElement;

    const handleDoubleClick = async () => {
        globalTrackManager.removeAllTracks();
    }

    onMount(() => {
        trackDisposalElement.addEventListener('dragenter', () => isDraggingOverStore.set(true));
        trackDisposalElement.addEventListener('dragover', (e:DragEvent) => {
            e.preventDefault();
            isDraggingOverStore.set(true);
        });
        trackDisposalElement.addEventListener('dragleave', () => isDraggingOverStore.set(false));
        trackDisposalElement.addEventListener('drop', () => isDraggingOverStore.set(false));
        globalDraggingManager.registerElement(trackDisposalElement);
    });
</script>

<button id="track-disposal-element" bind:this={trackDisposalElement}
    on:dblclick={handleDoubleClick}
    class="flex flex-row justify-center items-center p-2 rounded-lg text-sm cursor-pointer
    bg-stone-300 hover:bg-stone-400 text-stone-700 hover:text-red-600
    {$isDraggingOverStore ? 'bg-stone-400 text-red-600' : ''}
    ">
    <i class="fa-solid fa-trash"></i>
</button>