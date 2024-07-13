<script lang="ts">
    import SearchResultTrack from "./SearchResultTrack.svelte";
    import SearchResultAlbum from "./SearchResultAlbum.svelte";
    import { searchResultStore, SearchResultType, searchResultTypeStore } from "$lib/searchResult";
    import type { TrackManager } from "$lib/trackManager";

    export let globalTrackManager: TrackManager;    

    $: searchResultType = $searchResultTypeStore as SearchResultType;
    $: albumSearchResults = $searchResultStore?.albums ?? [];
    $: trackSearchResults = $searchResultStore?.tracks ?? [];
</script>

<div>
    {#if searchResultType === SearchResultType.TRACKS}
        {#each trackSearchResults as trackProps}
            <SearchResultTrack {globalTrackManager} {trackProps}/>
        {/each}
    {:else if searchResultType === SearchResultType.ALBUMS}
        {#each albumSearchResults as albumProps}
            <SearchResultAlbum {globalTrackManager} {albumProps}/>
        {/each}
    {/if}
</div>