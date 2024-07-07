import { type TrackModel } from "./models";
import { writable, get, type Writable } from "svelte/store";

export class TrackManager {
    private globalAudio: HTMLAudioElement | undefined;
    currentTrackIdStore: Writable<string | undefined>;
    trackListStore: Writable<TrackModel[]>;

    constructor(trackList: TrackModel[]) {
        this.currentTrackIdStore = writable<string>(undefined);
        this.trackListStore = writable<TrackModel[]>(trackList);
    }


    // handler for adding and removing tracks


    addTrack(track: TrackModel) {
        this.trackListStore.update((trackList) => {
            trackList.push(track);
            return trackList;
        })
    }

    removeTrackById(id: string) {
        if (get(this.currentTrackIdStore) === id) {
            this.globalAudio?.pause();
        };
        this.trackListStore.update((trackList) => {
            return trackList.filter((track) => track.id !== id);
        })
    }


    // handlers for single audio global playback


    toggleTrackPlayback(track: TrackModel) {
        const lastPlayingTrackId = get(this.currentTrackIdStore);
        this.globalAudio?.pause();
        if (track.id !== lastPlayingTrackId) {
            this.initAudio(track);
        }
    }


    // handlers for drag-and-drop functionality


    handleDragStart(event: DragEvent, id: string) {
        event.dataTransfer!.effectAllowed = 'move';
        this.trackListStore.update((trackList) => {
            return trackList.map((track) => track.id === id
                ? {...track, isDragging: true}
                : {...track, isDragging: false}
            )
        })
    }

    handleDragOver(event: DragEvent) {
        event.preventDefault();
        event.dataTransfer!.dropEffect = 'move';
    }

    handleDrop(event: DragEvent, id: string) {
        this.trackListStore.update((trackList) => {
            const droppedItemIndex = trackList.findIndex((track) => track.id === id);
            const draggedItemIndex = trackList.findIndex((track) => track.isDragging === true);
            const draggedItem = trackList.find((track) => track.isDragging === true) as TrackModel;

            if (draggedItemIndex !== droppedItemIndex) {
                let updatedTrackList = [...trackList];
                updatedTrackList.splice(draggedItemIndex, 1);
                updatedTrackList.splice(droppedItemIndex, 0, draggedItem);
                return updatedTrackList;
            }
            else return [...trackList];
        });
    }

    handleDragEnd(event: DragEvent) {
        this.trackListStore.update(trackList => trackList.map((track) => {
            return {
                ...track,
                isDragging: false,
            }
        }));
    }


    // internal functions


    private initAudio(track: TrackModel) {
        this.globalAudio = new Audio(track.previewURL);
        this.globalAudio.onplay = () => {
            this.currentTrackIdStore.set(track.id);
            this.trackListStore.update((trackList) => trackList.map((trackItem) => {return {...trackItem, isPlaying: trackItem.id === track.id}}))
        }
        this.globalAudio.onpause = () => {
            this.globalAudio!.currentTime = 0
            this.currentTrackIdStore.set(undefined);
            this.trackListStore.update((trackList) => trackList.map((track) => {return {...track, isPlaying: false}}));
        };
        this.globalAudio.onended = this.globalAudio.onpause;
        this.globalAudio.play();
    }
}
