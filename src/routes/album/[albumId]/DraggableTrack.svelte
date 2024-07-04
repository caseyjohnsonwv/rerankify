<script lang="ts">
    import type { AudioManager } from '$lib/audioManager';
    import { type TrackModel } from '$lib/models';
    
    // things we need to reference this track in the global player
    export let globalAudioManager: AudioManager;
    export let trackId: string;

    // things we need for reactive global music playing
    let props: TrackModel;
    globalAudioManager.trackListStore.subscribe((trackList) => {
        props = trackList.filter((track) => track.id === trackId).at(0) as TrackModel
    })
    const toggleSongPreview = () => {
        globalAudioManager.toggleTrack(props.id);
    }

    // other props
    let isStarred: boolean = false;
    const toggleStarredStatus = () => {
        isStarred = !isStarred;
    }
</script>

<div class="text-left text-slate-200 bg-slate-900 hover:bg-slate-700 py-2 px-5 hover:cursor-grab flex items-center justify-between">
    <div class="w-5/12 space-x-3 flex items-baseline">
        <p class="font-semibold line-clamp-1">{ props.name }</p>
    </div>
    <button on:click|preventDefault={toggleSongPreview} class="w-1/3 bg-slate-800 hover:bg-slate-900 rounded-md">
        <div class="text-center items-baseline flex justify-center space-x-3 py-3 hover:cursor-pointer">
            <p class="font-light text-slate-400">Preview</p>
            <i class="fa-solid {props.isPlaying ? 'fa-circle-stop' : 'fa-circle-play'} text-lg"></i>
        </div>
    </button>
    <div class="w-1/6 items-middle justify-end space-x-5 flex">
        <p class="font-mono text-slate-400">{ Math.floor(props.duration / 60) }:{ `${props.duration % 60}`.padStart(2, "0") }</p>
        <button on:click|preventDefault={toggleStarredStatus}>
            <i class="fa-solid fa-star text-xl hover:cursor-pointer hover:text-amber-500 {isStarred ? 'text-amber-500' : 'text-slate-200'}"></i>
        </button>
        <div><i class="fa-solid fa-bars text-2xl"></i></div>
    </div>
</div>
