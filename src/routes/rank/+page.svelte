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

    
    let persistStores = false;
    const trackListStoreKey = 'trackListStore';
    const albumCountStoreKey = 'albumCountStore';

    const currentTrackStore = globalTrackManager.currentTrackStore;
    const trackListStore = globalTrackManager.trackListStore;
    const albumCountTrackStore = globalTrackManager.albumTrackCountStore;

    $: if (persistStores) {
        if ($trackListStore) window.sessionStorage.setItem(trackListStoreKey, JSON.stringify($trackListStore));
        if ($albumCountTrackStore) {
            let persistedObject: Record<string, number> = {};
            $albumCountTrackStore.forEach((value, key) => {persistedObject[key] = value});
            window.sessionStorage.setItem(albumCountStoreKey, JSON.stringify(persistedObject));
        }
    }

    onMount(() => {
        globalTrackManager.toggleTrackPlayback($currentTrackStore as TrackModel);

        const trackListPersisted = window.sessionStorage.getItem(trackListStoreKey);
        if (trackListPersisted) trackListStore.set(JSON.parse(trackListPersisted));

        const albumCountsPersisted = window.sessionStorage.getItem(albumCountStoreKey);
        if (albumCountsPersisted) {
            const persistedValue: Map<string, number> = JSON.parse(albumCountsPersisted);
            albumCountTrackStore.set(new Map(Object.entries(persistedValue)));
        }

        persistStores = true;
    });
</script>

<div class="w-dvh h-dvh flex flex-col overflow-hidden">
    <Header userProps={data}/>
    <div class="flex-grow flex flex-row w-full">
        <TrackBin/>
        <RankingCanvas/>
    </div>
</div>