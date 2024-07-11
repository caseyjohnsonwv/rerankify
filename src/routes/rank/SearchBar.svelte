<script lang="ts">
    import type { AlbumModel, SearchResult, TrackModel } from "$lib/models";
    import type { TrackManager } from "$lib/trackManager";
    import { backendRoutes } from "$lib/routes";
    import SearchResultTrack from "./SearchResultTrack.svelte";
    import SearchResultAlbum from "./SearchResultAlbum.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";


    export let globalTrackManager: TrackManager;
    

    const enum SearchResultsType {
        ALBUMS = 'Albums',
        TRACKS = 'Tracks',
    }
    
    let searchResultsType: SearchResultsType = SearchResultsType.TRACKS;
    const setSearchResultsType = async (value:SearchResultsType) => {
        searchResultsType = value;
    }

    
    let inputElement: HTMLInputElement;
    let searchString: string = "";
    let albumSearchResults = [] as AlbumModel[];
    let trackSearchResults = [] as TrackModel[];

    $: { 
        if (searchString.length < 3) {
            albumSearchResults = [];
            trackSearchResults = [];
        }
    };

    const handleKeydown = async (e:KeyboardEvent) => {
        // only search once 3+ characters are entered
        if (searchString.length < 3) return;
        const res = await fetch(backendRoutes.search, {
            method: 'POST',
            body: JSON.stringify({ query: searchString }),
        });
        // if you delete the search too quickly for the async call to await, it can bug out and show results for an empty search
        // to handle it, check the searchstring's length again here
        const searchResult = searchString.length > 3 ? await res.json() as SearchResult : undefined;
        albumSearchResults = searchResult?.albums ?? [];
        trackSearchResults = searchResult?.tracks ?? [];
    }

    const handleClearSearchInput = async () => {
        searchString = "";
        inputElement.focus();
    }

    onMount(() => {
        if (albumSearchResults.length + trackSearchResults.length === 0) inputElement.focus();
    })
</script>

<div class="flex flex-row justify-center">
    <input on:keydown={handleKeydown} bind:value={searchString} bind:this={inputElement}
        type="text" placeholder="Start typing here to search Spotify ..." autocomplete="off" spellcheck="false"
        class="w-2/3 mx-4 py-2 px-4 rounded-full outline-none ring-2 ring-stone-500"
    />
    {#if searchString.length > 0}
        <button on:click={() => handleClearSearchInput()}
            class="-translate-x-11 w-0 flex flex-row items-center" transition:fade={{duration: 100}}
            >
            <i class="fa-solid fa-x text-sm hover:text-stone-600"></i>
        </button>
    {/if}
    <div class="flex flex-row justify-center text-sm">
        <button on:click={() => setSearchResultsType(SearchResultsType.ALBUMS)} class="py-2 px-4 rounded-l-lg
            {searchResultsType === SearchResultsType.ALBUMS ? 'bg-purple-700 text-stone-100' : 'bg-stone-200 hover:bg-stone-300'}
            ">
            {SearchResultsType.ALBUMS}
        </button>
        <button on:click={() => setSearchResultsType(SearchResultsType.TRACKS)} class="py-2 px-4 rounded-r-lg
            {searchResultsType === SearchResultsType.TRACKS ? 'bg-purple-700 text-stone-100' : 'bg-stone-200 hover:bg-stone-300'}
            ">
            {SearchResultsType.TRACKS}
        </button>
    </div>
</div>
<div class="flex flex-col justify-center mx-auto w-2/3">
    {#if searchResultsType === SearchResultsType.TRACKS}
        {#each trackSearchResults as trackProps}
            <SearchResultTrack {globalTrackManager} {trackProps}/>
        {/each}
    {:else if searchResultsType === SearchResultsType.ALBUMS}
        {#each albumSearchResults as albumProps}
            <SearchResultAlbum {globalTrackManager} {albumProps}/>
        {/each}
    {/if}
</div>
