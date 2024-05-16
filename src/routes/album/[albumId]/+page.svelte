<script lang="ts">
    import type { PageData } from './$types';
    import DraggableTrack from './DraggableTrack.svelte';
    export let data: PageData;

    $: trackList = data.album?.tracks ?? [];
</script>

<div class="mx-auto max-w-6xl flex flex-col justify-center space-y-2 min-h-screen">
    {#each trackList as trackObj}
        <DraggableTrack props={trackObj}/>
    {/each}
</div>
