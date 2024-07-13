<script lang="ts">
    import type { TrackManager } from "$lib/trackManager";
    import SearchBar from "./SearchBar.svelte";
    import NowPlayingWidget from "./NowPlayingWidget.svelte";

    export let globalTrackManager: TrackManager;
    const trackListStore = globalTrackManager.trackListStore;
    $: trackCount = $trackListStore.length;
</script>

<div class="h-full flex flex-col space-y-4 py-2 px-4 bg-stone-100 text-stone-800 border-r border-r-stone-500">
    <div class="py-4 space-y-6 border-y border-b-stone-500">
        <SearchBar/>
        <NowPlayingWidget {globalTrackManager}/>
    </div>
    {#if $trackListStore.length > 0}
        <div class="flex-grow overflow-x-hidden overflow-y-scroll space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-700 scrollbar-thumb-rounded-full">
            {#each $trackListStore as trackProps}
                <div>{trackProps.name}</div>
            {/each}
        </div>
    {:else}
        <span class="text-xs text-center italic">Search Spotify to get started!</span>
    {/if}
</div>
