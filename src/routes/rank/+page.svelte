<script lang="ts">
    import { onMount } from 'svelte';
    import type { Session } from "@auth/sveltekit";
    import { DraggingManager } from '$lib/draggingManager';
    import { globalTrackManager, TrackManager } from "$lib/trackManager";
    import type { TrackModel } from "$lib/models";
    import { searchResultStore } from '$lib/searchResult';
    import Header from "./Header.svelte";
    import TrackBin from "./TrackBin.svelte";
    import SearchResultsPane from './SearchResultsPane.svelte';

    // passed from +layout.server.ts via +layout.svelte on page load
    export let data: Session;

    const currentTrackStore = globalTrackManager.currentTrackStore;

    $: displaySearch = ($searchResultStore?.albums.length ?? 0) + ($searchResultStore?.tracks.length ?? 0) > 0;

    onMount(() => {
        globalTrackManager.toggleTrackPlayback($currentTrackStore as TrackModel);
    });
</script>

<div class="w-dvh h-dvh flex flex-col overflow-hidden">
    <Header userProps={data}/>
    <div class="flex-grow grid grid-cols-4">
        <div class="col-span-1">
            <TrackBin/>
        </div>
        <div class="col-span-3 flex relative z-0">
            {#if displaySearch}
                <div class="absolute inset-2 z-10 w-5/6">
                    <SearchResultsPane/>
                </div>
            {/if}
            <div class="w-full">
                <!-- future canvas content goes here -->
            </div>
        </div>
    </div>
</div>