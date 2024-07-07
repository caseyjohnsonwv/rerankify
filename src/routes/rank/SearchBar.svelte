<script lang="ts">
    import type { AlbumModel, TrackModel } from "$lib/models";
    import type { TrackManager } from "$lib/trackManager";
    import { backendRoutes } from "$lib/routes";

    export let globalTrackManager: TrackManager;

    let searchString: string = "";
    let searchResults: (TrackModel|AlbumModel)[];
    $: { if (searchString.length < 3) searchResults = []; }

    // $: albumResults = searchResults?.filter((item) => (item as AlbumModel).trackList !== undefined) as AlbumModel[] ?? [];
    $: trackResults = searchResults?.filter((item) => (item as TrackModel).duration !== undefined) as TrackModel[] ?? [];
    let currentlyPlayingTrack: TrackModel | undefined;

    const handleKeydown = async (e:KeyboardEvent) => {
        // only search once 3+ characters are entered
        if (searchString.length < 2) return;
        const res = await fetch(backendRoutes.search, {
            method: 'POST',
            body: JSON.stringify({ query: searchString }),
        });
        // if you delete the search too quickly for the async call to await, it can bug out and show results for an empty search
        // to handle it, check the searchstring's length again here
        searchResults = searchString.length > 3 ? await res.json() as (TrackModel|AlbumModel)[] : [];
    }

    const handlePlayToggle = async (track: TrackModel) => {
        currentlyPlayingTrack = globalTrackManager.toggleTemporaryTrack(track);
    }

    const handleAddToTrackManager = async (track: TrackModel) => {
        globalTrackManager.addTrack(track);
    }
</script>

<div class="flex flex-row justify-center">
    <input on:keydown={handleKeydown} bind:value={searchString}
        type="text" placeholder="Search for a song or album ..." autocomplete="off" spellcheck="false"
        class="w-2/3 py-2 px-4 rounded-full outline-none ring-2 ring-stone-500"
    />
</div>
<div class="flex flex-col justify-center mx-auto w-2/3">
    {#each trackResults as trackProps}
        <div class="max-h-14 grid grid-cols-8 items-center my-1 py-1 px-4 border-s-2 border-stone-500 hover:bg-stone-100 hover:cursor-pointer">
            <div class="col-span-4 flex flex-row items-center space-x-2">
                <img src={trackProps.coverArtUrl} alt="" class="h-10 rounded-sm"/>
                <div class="subgrid grid-rows-2">
                    <span class="font-semibold line-clamp-1">{trackProps.name}</span>
                    <span class="text-xs line-clamp-1">{trackProps.artistNames?.at(0)}</span>
                </div>
            </div>
            <button on:click={() => handlePlayToggle(trackProps)} on:keydown={(e) => {if(e.keyCode === 32) e.preventDefault()}}
                class="col-span-3 w-full p-2 text-xl rounded-lg outline-none
                {trackProps.id === currentlyPlayingTrack?.id ? 'bg-purple-600 hover:bg-purple-500 text-stone-100' : 'bg-stone-200 hover:bg-stone-300'}
                ">
                {#if trackProps.id === currentlyPlayingTrack?.id}
                    <i class="fa-solid fa-circle-stop"></i>
                {:else}
                    <i class="fa-solid fa-circle-play"></i>
                {/if}
            </button>
            <div class="col-span-1 flex flex-row items-center justify-end space-x-2">
                <span class="font-light text-xs">{Math.floor(trackProps.duration / 60) }:{ `${trackProps.duration % 60}`.padStart(2, "0")}</span>
                <button on:click={() => handleAddToTrackManager(trackProps)}>
                    <i class="fa-solid fa-circle-plus text-xl text-purple-700 hover:text-purple-900"></i>
                </button>
            </div>
        </div>
    {/each}
</div>
