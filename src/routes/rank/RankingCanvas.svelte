<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { globalTrackManager } from "$lib/trackManager";
    import { globalDraggingManager, TriggerableElements } from "$lib/draggingManager";
    import { searchResultStore } from '$lib/searchResult';
    import TrackCard from "./TrackCard.svelte";
    import SearchResultsPane from "./SearchResultsPane.svelte";

    let rootElement: HTMLElement;
    const isDraggedOverStore = writable<boolean>(false);
    const trackListStore = globalTrackManager.trackListStore;

    $: displaySearch = ($searchResultStore?.albums.length ?? 0) + ($searchResultStore?.tracks.length ?? 0) > 0;
    $: tracksInCanvas = $trackListStore.filter((track) => track.canvasX && track.canvasY);

    onMount(() => {
        rootElement.addEventListener('dragenter', () => isDraggedOverStore.set(true));
        rootElement.addEventListener('dragover', (e:DragEvent) => {
            e.preventDefault();
            isDraggedOverStore.set(true);
        });
        rootElement.addEventListener('dragleave', () => isDraggedOverStore.set(false));
        rootElement.addEventListener('drop', () => isDraggedOverStore.set(false));
        globalDraggingManager.registerElement(rootElement);
    })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div id="{TriggerableElements.CANVAS_ROOT_ELEMENT}" bind:this={rootElement}
    class="w-full h-full">
    {#if displaySearch}
        <div class="flex flex-grow relative z-0">
            <div class="absolute inset-2 z-10 w-5/6">
                <SearchResultsPane/>
            </div>
        </div>
    {/if}
    {#each tracksInCanvas as trackProps}
        <TrackCard props={trackProps}/>
    {/each}
</div>
