<script lang="ts">
    import { fade } from 'svelte/transition';
    import { TrackManager } from "$lib/trackManager";
    import type { Session } from "@auth/sveltekit";
    import SearchBar from "./SearchBar.svelte";
    import { signOut } from "@auth/sveltekit/client";
    import type { TrackModel } from "$lib/models";
    import { onMount } from 'svelte';

    export let data: Session;

    const globalTrackManager = new TrackManager([]);
    const currentTrackStore = globalTrackManager.currentTrackStore;

    const handleSignOut = async () => {
        signOut();
    }

    const handleStopPlayback = async () => {
        globalTrackManager.toggleTrackPlayback($currentTrackStore as TrackModel);
    }

    onMount(() => {
        globalTrackManager.toggleTrackPlayback($currentTrackStore as TrackModel);
    })
</script>

<nav class="grid grid-cols-4 items-center px-8 max-h-12 bg-purple-700 text-slate-50">
    {#if $currentTrackStore}
        <div class="col-span-1 pl-1 pr-3 py-1 max-h-10 flex flex-row items-center space-x-2 bg-stone-100 rounded-full text-stone-800" transition:fade={{duration: 100}}>
            {#if $currentTrackStore?.coverArtUrl}
                <img src={$currentTrackStore?.coverArtUrl} alt="" class="h-8 rounded-full"/>
            {/if}
            <span class="flex-grow text-xs line-clamp-1">
                <span class="font-semibold">{$currentTrackStore?.name}</span> | {$currentTrackStore?.artistNames.at(0)}
            </span>
            <button on:click={handleStopPlayback} class="h-10 flex flex-row items-center">
                <i class="fa-solid fa-circle-stop text-2xl hover:text-purple-700"></i>
            </button>
            <i class="fa-solid fa-volume-high text-xxs animate-pulse text-stone-400"></i>
        </div>
    {/if}
    <div class="col-start-2 col-span-2 text-center p-2">
        <span class="text-2xl font-bold italic">Rankify.</span>
    </div>
    <div class="col-span-1 flex flex-row items-center justify-end space-x-2 p-2">
        <img src="{data.user?.image}" alt="" class="max-h-8 rounded-full"/>
        <span class="font-medium">{data.user?.name}</span>
        <span>|</span>
        <button on:click={handleSignOut} class="flex flex-row items-center space-x-2 hover:text-slate-200 font-light">
            <span class="underline underline-offset-2">Sign Out</span>
            <i class="fa-solid fa-right-from-bracket"></i>
        </button>
    </div>
</nav>
<div class="flex flex-col justify-center space-y-4 pt-4">
    <SearchBar {globalTrackManager}/>
</div>

<style>
    .text-xxs {
        font-size: 0.6rem;
        line-height: 0.75rem;
    }
</style>