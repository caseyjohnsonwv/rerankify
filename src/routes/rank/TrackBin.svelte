<script lang="ts">
    import { globalTrackManager } from "$lib/trackManager";
    import { TriggerableElements } from "$lib/draggingManager";
    import SearchBar from "./SearchBar.svelte";
    import NowPlayingWidget from "./NowPlayingWidget.svelte";
    import TrackCard from "./TrackCard.svelte";
    import TrackDisposal from "./TrackDisposal.svelte";
    import { onMount } from "svelte";

    const trackListStore = globalTrackManager.trackListStore;
    const trackRackId = 'track-rack';

    $: tracksNotInCanvas = $trackListStore.filter((track) => track.canvasX === undefined && track.canvasY === undefined);

    let remainingHeight = 0;

    const updateHeight = () => {
        const trackBinTop = (document.querySelector(trackRackId) as HTMLElement)?.offsetHeight ?? 0;
        const trackBinBottom = (document.querySelector(TriggerableElements.TRACK_DISPOSAL_ELEMENT) as HTMLElement)?.offsetHeight ?? 0;
        remainingHeight = window.innerHeight - trackBinTop + trackBinBottom;
    }

    const handleDoubleClickDelete = async () => {
        globalTrackManager.removeAllNonCanvasTracks();
    }
    
    onMount(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
    });
</script>

<div class="h-full w-96 flex flex-col space-y-4 py-2 px-2 bg-stone-100 text-stone-800 border-r border-r-stone-500">
    <div class="py-4 space-y-6 border-b border-b-stone-500">
        <SearchBar/>
        <NowPlayingWidget/>
    </div>
    <div id="{trackRackId}"
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
    <button on:dblclick={handleDoubleClickDelete}
        class="flex flex-row justify-center items-center p-2 h-12 space-x-2 rounded-lg text-lg outline-none ring-1
         text-stone-500 ring-stone-400 hover:text-red-500 hover:ring-red-500 hover:font-bold
        ">
        <span class="text-xs">Double click here to delete all tracks</span>
        <i class="fa-solid fa-hand-pointer"></i>
    </button>
</div>
