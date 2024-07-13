<script lang="ts">
    import type { SearchResult } from "$lib/models";
    import { backendRoutes } from "$lib/routes";
    import { searchResultStore, searchResultTypeStore, SearchResultType } from "$lib/searchResult";
    import { fade } from "svelte/transition";

    
    let searchResultType: SearchResultType = $searchResultTypeStore;
    const setSearchResultsType = async (value:SearchResultType) => {
        searchResultType = value;
        searchResultTypeStore.set(value);
    }

    
    let inputElement: HTMLInputElement;
    let searchString: string = "";

    $: { 
        if (searchString.length < 3) {
            searchResultStore.set(undefined);
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
        searchResultStore.set(searchResult);
    }

    const handleClearSearchInput = async () => {
        searchString = "";
        inputElement.focus();
    }
</script>

<div class="space-y-2">
    <div class="flex flex-row justify-center">
        <input on:keydown={handleKeydown} bind:value={searchString} bind:this={inputElement}
            type="text" placeholder="Search Spotify ..." autocomplete="off" spellcheck="false"
            class="py-2 px-4 w-full rounded-full outline-none ring-1 ring-stone-500 text-sm"
        />
        {#if searchString.length > 0}
            <button on:click={() => handleClearSearchInput()}
                class="-translate-x-6 w-0 flex flex-row items-center" transition:fade={{duration: 100}}
                >
                <i class="fa-solid fa-x text-sm text-stone-700 hover:text-stone-500"></i>
            </button>
        {/if}
    </div>
    <div class="flex flex-row justify-center text-xs">
        <button on:click={() => setSearchResultsType(SearchResultType.ALBUMS)} class="py-2 px-8 rounded-l-lg
            {searchResultType === SearchResultType.ALBUMS ? 'bg-purple-700 text-stone-100' : 'bg-stone-200 hover:bg-stone-300'}
            ">
            {SearchResultType.ALBUMS}
        </button>
        <button on:click={() => setSearchResultsType(SearchResultType.TRACKS)} class="py-2 px-8 rounded-r-lg
            {searchResultType === SearchResultType.TRACKS ? 'bg-purple-700 text-stone-100' : 'bg-stone-200 hover:bg-stone-300'}
            ">
            {SearchResultType.TRACKS}
        </button>
    </div>
</div>
