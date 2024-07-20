<script lang="ts">
    import SearchResultTrack from "./SearchResultTrack.svelte";
    import SearchResultAlbum from "./SearchResultAlbum.svelte";
    import { searchResultStore, SearchResultType, searchResultTypeStore } from "$lib/searchResult";
    import { globalDraggingManager } from "$lib/draggingManager";
    import { onMount } from "svelte";

    $: searchResultType = $searchResultTypeStore as SearchResultType;
    $: albumSearchResults = $searchResultStore?.albums ?? [];
    $: trackSearchResults = $searchResultStore?.tracks ?? [];

    let rootElement: HTMLElement;
    onMount(() => {
        rootElement.addEventListener('dragover', (e) => e.preventDefault());
        globalDraggingManager.registerElement(rootElement);
    });
</script>

<div bind:this={rootElement}
    class="bg-stone-200 p-3 space-y-3 rounded-lg rounded-tl-none max-h-[32rem]
    overflow-y-scroll scrollbar scrollbar-w-2 scrollbar-thumb-rounded-full scrollbar-thumb-stone-500
    ">
    {#if searchResultType === SearchResultType.TRACKS}
        {#each trackSearchResults as trackProps}
            <SearchResultTrack {trackProps}/>
        {/each}
    {:else if searchResultType === SearchResultType.ALBUMS}
        {#each albumSearchResults as albumProps}
            <SearchResultAlbum {albumProps}/>
        {/each}
    {/if}
    <div class="text-center">
        <span class="text-xs italic font-light">Don't see what you're looking for? Try changing your search query! </span>
    </div>
</div>