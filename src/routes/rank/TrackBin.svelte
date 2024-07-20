<script lang="ts">
    import { globalTrackManager } from "$lib/trackManager";
    import { globalDraggingManager, TriggerableElements } from "$lib/draggingManager";
    import SearchBar from "./SearchBar.svelte";
    import NowPlayingWidget from "./NowPlayingWidget.svelte";
    import TrackCard from "./TrackCard.svelte";
    import TrackDisposal from "./TrackDisposal.svelte";
    import { onMount } from "svelte";

    const trackListStore = globalTrackManager.trackListStore;

    $: tracksNotInCanvas = $trackListStore.filter((track) => track.canvasX === undefined && track.canvasY === undefined);

    let remainingHeight = 0;

    const updateHeight = () => {
        const trackBinTop = (document.querySelector(TriggerableElements.TRACK_RACK_ELEMENT) as HTMLElement)?.offsetHeight ?? 0;
        const trackBinBottom = (document.querySelector(TriggerableElements.TRACK_DISPOSAL_ELEMENT) as HTMLElement)?.offsetHeight ?? 0;
        remainingHeight = window.innerHeight - trackBinTop + trackBinBottom;
    }

    let trackRackElement: HTMLElement;
    onMount(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);

        // trackRackElement.addEventListener('dragenter', () => isDraggingOverStore.set(true));
        trackRackElement.addEventListener('dragover', (e:DragEvent) => {
            e.preventDefault();
            // isDraggingOverStore.set(true);
        });
        // trackRackElement.addEventListener('dragleave', () => isDraggingOverStore.set(false));
        // trackRackElement.addEventListener('drop', () => isDraggingOverStore.set(false));
        globalDraggingManager.registerElement(trackRackElement);
    });
</script>

<div class="h-full w-96 flex flex-col space-y-4 py-2 px-2 bg-stone-100 text-stone-800 border-r border-r-stone-500">
    <div class="py-4 space-y-6 border-b border-b-stone-500">
        <SearchBar/>
        <NowPlayingWidget/>
    </div>
    <div id="{TriggerableElements.TRACK_RACK_ELEMENT}" bind:this={trackRackElement}
        class="bg-stone-300 p-2 flex-grow space-y-2 rounded-md overflow-x-hidden text-center
        overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-rounded-full scrollbar-thumb-stone-500"
        style="height: {remainingHeight}"
        >
        {#if $trackListStore.length > 0}
            {#if tracksNotInCanvas.length > 0}
                {#each tracksNotInCanvas as trackProps}
                    <TrackCard props={trackProps}/>
                {/each}
                
            {:else}
                <span class="text-xs italic">All tracks are imported!</span>
            {/if}
        {:else}
            <span class="text-xs italic">Search Spotify to get started!</span>
        {/if}
    </div>
    <TrackDisposal/>
</div>
