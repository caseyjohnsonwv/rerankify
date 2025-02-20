<script lang="ts">
    import type { AlbumModel, TracksByAlbumIdResult } from "$lib/models";
    import { globalTrackManager } from "$lib/trackManager";
    import { backendRoutes } from "$lib/routes";

    export let albumProps: AlbumModel;

    const enum AlbumAddState {
        NONE = 'none',
        PARTIAL = 'partial',
        ALL = 'all',
    }

    const determineAlbumAddState = (currentCount: number, totalCount: number) => {
        if (currentCount === 0) return AlbumAddState.NONE
        else if (currentCount === totalCount) return AlbumAddState.ALL
        else return AlbumAddState.PARTIAL;
    }
    
    const trackListStore = globalTrackManager.trackListStore;
    const albumCountTrackStore = globalTrackManager.albumTrackCountStore;
    $: albumTrackCount = $albumCountTrackStore.get(albumProps.id) ?? 0;
    $: albumAddState = determineAlbumAddState(albumTrackCount, albumProps.trackCount);
    $: remainingAddCount = albumProps.trackCount - albumTrackCount;

    // for loading animation while adding entire album
    let isAdding: boolean = false;

    const handleTrackManagerAction = async (album: AlbumModel) => {
        if (albumAddState !== AlbumAddState.ALL) {
            isAdding = true;
            const res = await fetch(backendRoutes.tracksByAlbumId, {
                method: 'POST',
                body: JSON.stringify({ albumId: album.id }),
            });
            const trackListResults = await res.json() as TracksByAlbumIdResult;
            trackListResults.trackList.forEach((track) => globalTrackManager.addTrack(track));
            isAdding = false;
        }
        else {
            $trackListStore.filter((track) => track.albumId === albumProps.id)
                .forEach((track) => globalTrackManager.removeTrackById(track.id));
        }
    }
</script>

<div class="max-h-14 grid grid-cols-8 items-center py-1 px-4 border-s-2 text-stone-800 border-stone-500 bg-stone-100 hover:bg-purple-100 hover:cursor-pointer">
    <div class="col-span-3 flex flex-row items-center space-x-2">
        <img src={albumProps.coverArtUrl} alt="" class="h-10 rounded-sm"/>
        <div class="subgrid grid-rows-2">
            <span class="font-semibold line-clamp-1">{albumProps.name}</span>
            <span class="text-xs line-clamp-1">{albumProps.artistNames?.at(0)}</span>
        </div>
    </div>
    <div class="col-span-2 flex flex-row justify-left items-baseline w-full p-2 space-x-4">
        <span class="text-xs">{albumProps.releaseYear}</span>
        <span class="text-sm font-medium">{albumProps.type.toLocaleUpperCase()}</span>
    </div>
    <button on:click={() => handleTrackManagerAction(albumProps)}
        class="col-span-3 p-2 rounded-lg flex flex-row items-center justify-end space-x-4 bg-stone-200 hover:bg-stone-300
        {isAdding ? 'animate-pulse' : ''}
        ">
        <div class="flex-grow text-left text-sm px-3">
            {#if albumAddState === AlbumAddState.ALL}
                <span class="italic">All Items Added</span>
            {:else if albumAddState === AlbumAddState.PARTIAL}
                Add <span class="font-bold px-1">{remainingAddCount}</span> more {remainingAddCount === 1 ? 'item' : 'items'}
            {:else}
                Add <span class="font-bold px-1">{remainingAddCount}</span> {remainingAddCount === 1 ? 'item' : 'items'}
            {/if}
        </div>
        {#if albumAddState === AlbumAddState.NONE}
            <i class="fa-solid fa-circle-plus text-xl text-purple-700 hover:text-purple-900"></i>
        {:else if albumAddState === AlbumAddState.PARTIAL}
            <i class="fa-solid fa-circle-plus text-xl text-yellow-600 hover:text-yellow-800"></i>
        {:else}
            <i class="fa-solid fa-circle-check text-xl text-green-600 hover:text-green-800"></i>
        {/if}
    </button>
</div>