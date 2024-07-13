<script lang="ts">
    import type { TrackManager } from "$lib/trackManager";
    import SearchBar from "./SearchBar.svelte";

    export let globalTrackManager: TrackManager;
    const trackListStore = globalTrackManager.trackListStore;
    $: trackCount = $trackListStore.length;
</script>

<div class="h-full flex flex-col space-y-4 px-4 bg-stone-100 text-stone-800 border-r border-r-stone-500">
    <div class="py-6 flex flex-col space-y-6 border-b border-b-stone-500">
        <span class="text-sm text-center">Playlist Name Placeholder</span>
        <SearchBar/>
    </div>
    <div class="flex flex-row justify-center space-x-1 text-center text-sm">
        <span class="underline underline-offset-8 text-base font-light">Imported Tracks</span>
        {#if trackCount > 0}
            <span>({trackCount})</span>
        {/if}
    </div>
    <div class="flex-grow overflow-x-hidden overflow-y-scroll space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-700 scrollbar-thumb-rounded-full">
        {#each $trackListStore as trackProps}
            <div>{trackProps.name}</div>
        {/each}
    </div>
</div>
