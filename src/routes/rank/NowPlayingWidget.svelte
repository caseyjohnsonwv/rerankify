<script lang="ts">
    import type { TrackModel } from "$lib/models";
    import type { TrackManager } from "$lib/trackManager";
    import { fade } from "svelte/transition";

    export let globalTrackManager: TrackManager;
    const currentTrackStore = globalTrackManager.currentTrackStore;

    const handleStopPlayback = async () => {
        globalTrackManager.toggleTrackPlayback($currentTrackStore as TrackModel);
    }
</script>

<div class="flex flex-col space-y-2">
    <span class="text-sm text-center">Now Playing:</span>
    <div class="w-full pl-1 pr-3 py-1 max-h-10 flex flex-row items-center space-x-2 bg-stone-200 ring-1 ring-stone-500 rounded-full text-stone-800"
        transition:fade={{duration: 100}}
        >
        <img src={$currentTrackStore?.coverArtUrl} alt="" class="h-8 rounded-full animate-spin-slow"/>
        <span class="flex-grow text-xs line-clamp-1">
            {#if $currentTrackStore}
                <span class="font-semibold">{$currentTrackStore?.name}</span> | {$currentTrackStore?.artistNames.at(0)}
            {/if}
        </span>
        {#if $currentTrackStore}
            <button on:click={handleStopPlayback} class="h-10 flex flex-row items-center">
                <i class="fa-solid fa-circle-stop text-xl hover:text-stone-600"></i>
            </button>
        {/if}
    </div>
</div>

<style>
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin-slow {
        animation: spin 3s linear infinite;
    }
</style>