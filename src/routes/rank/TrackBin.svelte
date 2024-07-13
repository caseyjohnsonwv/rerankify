<script lang="ts">
    import { globalTrackManager } from "$lib/trackManager";
    import SearchBar from "./SearchBar.svelte";
    import NowPlayingWidget from "./NowPlayingWidget.svelte";
    import DraggableTrack from "./TrackCard.svelte";
    import { onMount } from "svelte";
    import TrackDisposal from "./TrackDisposal.svelte";

    const trackListStore = globalTrackManager.trackListStore;

    let remainingHeight = 0;

    const updateHeight = () => {
        const trackBinTop = (document.querySelector('#top-of-track-bin') as HTMLElement).offsetHeight;
        const trackBinBottom = (document.querySelector('#track-disposal-element') as HTMLElement).offsetHeight;
        remainingHeight = window.innerHeight - trackBinTop + trackBinBottom;
    }
    
    onMount(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
    });
</script>

<div class="h-full flex flex-col space-y-4 py-2 px-4 bg-stone-100 text-stone-800 border-r border-r-stone-500">
    <div class="py-4 space-y-6 border-b border-b-stone-500">
        <SearchBar/>
        <NowPlayingWidget/>
    </div>
    <div id="top-of-track-bin"
        class="bg-stone-300 p-2 flex-grow space-y-2 rounded-md overflow-x-hidden text-center
        overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-rounded-full scrollbar-thumb-stone-500"
        style="height: {remainingHeight}"
        >
        {#if $trackListStore.length > 0}
            {#each $trackListStore as trackProps}
                <DraggableTrack props={trackProps}/>
            {/each}
        {:else}
            <span class="text-xs italic">Search Spotify to get started!</span>
        {/if}
    </div>
    <TrackDisposal/>
</div>
