<script lang="ts">
    import { globalDraggingManager, TriggerableElements } from "$lib/draggingManager";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    const isDraggedOverStore = writable<boolean>(false);
    let trackDisposalElement: HTMLElement;

    onMount(() => {
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
    class="flex flex-row justify-center items-center p-2 h-12 space-x-2 rounded-lg text-lg ring-1 outline-none hover:cursor-default
    {$isDraggedOverStore ? 'bg-red-500 text-stone-200 ring-red-500' : 'text-stone-500 ring-stone-400'}
    ">
    <span class="text-xs">Drag tracks here to delete</span>
    <i class="fa-solid fa-trash"></i>
</button>