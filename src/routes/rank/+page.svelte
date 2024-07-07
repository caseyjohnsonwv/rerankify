<script lang="ts">
    import { TrackManager } from "$lib/trackManager";
    import SearchBar from "./SearchBar.svelte";

    const globalTrackManager = new TrackManager([]);
</script>

<div class="flex flex-col justify-center space-y-4">
    <SearchBar {globalTrackManager}/>
</div>
