<script lang="ts">
    import { TrackManager } from "$lib/trackManager";
    import type { Session } from "@auth/sveltekit";
    import SearchBar from "./SearchBar.svelte";
    import type { TrackModel } from "$lib/models";
    import { onMount } from 'svelte';
    import Header from "./Header.svelte";

    // passed from +layout.server.ts via +layout.svelte on page load
    export let data: Session;

    const globalTrackManager = new TrackManager([]);
    const currentTrackStore = globalTrackManager.currentTrackStore;

    onMount(() => {
        globalTrackManager.toggleTrackPlayback($currentTrackStore as TrackModel);
    })
</script>

<Header userProps={data} {globalTrackManager}/>
<div class="flex flex-col justify-center space-y-4 pt-4">
    <SearchBar {globalTrackManager}/>
</div>
