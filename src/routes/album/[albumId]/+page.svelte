<script lang="ts">
    import type { PageData } from './$types';
    import { AudioManager } from '$lib/audioManager';
    import DraggableTrack from './DraggableTrack.svelte';
    export let data: PageData;

    const globalAudioManager = new AudioManager(data.album.trackList);
</script>

<div class="mx-auto max-w-6xl flex flex-col justify-center space-y-2 min-h-screen">
    {#each data.album.trackList as trackModel }
        <DraggableTrack { globalAudioManager } trackId = { trackModel.id } />
    {/each}
</div>
