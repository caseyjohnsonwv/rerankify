<script lang="ts">
    import type { PageData } from './$types';
    import { TrackManager } from '$lib/trackManager';
    import DraggableTrack from './DraggableTrack.svelte';
    import type { TrackModel } from '$lib/models';
    export let data: PageData;

    const globalTrackManager = new TrackManager(data.album.trackList);
    const trackListStore = globalTrackManager.trackListStore;
</script>

<div class="mx-auto max-w-6xl flex flex-col justify-center space-y-2 min-h-screen">
    {#each $trackListStore as trackModel, index}
        <DraggableTrack globalTrackManager={ globalTrackManager } trackId = { trackModel.id }/>
    {/each}
</div>
