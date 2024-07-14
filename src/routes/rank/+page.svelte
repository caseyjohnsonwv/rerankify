<script lang="ts">
    import { onMount } from 'svelte';
    import type { Session } from "@auth/sveltekit";
    import { globalTrackManager } from "$lib/trackManager";
    import type { TrackModel } from "$lib/models";
    import Header from "./Header.svelte";
    import TrackBin from "./TrackBin.svelte";
    import RankingCanvas from './RankingCanvas.svelte';

    // passed from +layout.server.ts via +layout.svelte on page load
    export let data: Session;

    const currentTrackStore = globalTrackManager.currentTrackStore;

    onMount(() => {
        globalTrackManager.toggleTrackPlayback($currentTrackStore as TrackModel);
    });
</script>

<div class="w-dvh h-dvh flex flex-col overflow-hidden">
    <Header userProps={data}/>
    <div class="flex-grow flex flex-row w-full">
        <TrackBin/>
        <RankingCanvas/>
    </div>
</div>