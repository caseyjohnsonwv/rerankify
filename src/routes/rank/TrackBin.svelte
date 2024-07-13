<script lang="ts">
    import type { TrackManager } from "$lib/trackManager";
    import SearchBar from "./SearchBar.svelte";
    import NowPlayingWidget from "./NowPlayingWidget.svelte";
    import DraggableTrack from "./TrackCard.svelte";
    import { onMount } from "svelte";

    export let globalTrackManager: TrackManager;
    const trackListStore = globalTrackManager.trackListStore;

    let remainingHeight = 0;

    const updateHeight = () => {
        const trackBinTop = (document.querySelector('#top-of-track-bin') as HTMLElement).offsetHeight;
        const trackBinBottom = (document.querySelector('#bottom-of-track-bin') as HTMLElement).offsetHeight;
        remainingHeight = window.innerHeight - trackBinTop + trackBinBottom;
    }
    
    onMount(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    });
</script>

<div class="h-full flex flex-col space-y-4 py-2 px-4 bg-stone-100 text-stone-800 border-r border-r-stone-500">
    <div class="py-4 space-y-6 border-b border-b-stone-500">
        <SearchBar/>
        <NowPlayingWidget {globalTrackManager}/>
    </div>
    <div id="top-of-track-bin"
        class="bg-stone-300 p-2 flex-grow space-y-2 rounded-md overflow-x-hidden text-center
        overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-rounded-full scrollbar-thumb-stone-500"
        style="height: {remainingHeight}"
        >
        {#if $trackListStore.length > 0}
            {#each $trackListStore as trackProps}
                <DraggableTrack props={trackProps} {globalTrackManager}/>
            {/each}
        {:else}
            <span class="text-xs italic">Search Spotify to get started!</span>
        {/if}
    </div>
    <div id="bottom-of-track-bin"
        class="flex flex-row justify-center items-center p-2 rounded-lg text-sm
        bg-stone-300 hover:bg-stone-400 text-stone-700 hover:text-red-600"
        >
        <i class="fa-solid fa-trash"></i>
    </div>
</div>
