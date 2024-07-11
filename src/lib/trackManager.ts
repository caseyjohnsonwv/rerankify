import { type AlbumModel, type TrackModel } from "./models";
import { writable, get, type Writable } from "svelte/store";

export class TrackManager {
    private globalAudio: HTMLAudioElement | undefined;
    currentTrackStore: Writable<TrackModel | undefined>;
    trackListStore: Writable<TrackModel[]>;
    albumTrackCountStore: Writable<Map<string, number>>;

    constructor(trackList: TrackModel[]) {
        this.currentTrackStore = writable<TrackModel>(undefined);
        this.trackListStore = writable<TrackModel[]>(trackList);
        this.albumTrackCountStore = writable<Map<string, number>>(new Map());
    }


    // handler for adding and removing tracks


    addTrack(track: TrackModel) {
        const trackIds = get(this.trackListStore).map((track) => track.id);
        if (!trackIds.includes(track.id)) {
            this.trackListStore.update((trackList) => {
                trackList.push(track);
                return trackList;
            });
            if (track.albumId) {
                this.albumTrackCountStore.update((m) => {
                    const newValue = (m.get(track.albumId as string) ?? 0) + 1;
                    m.set(track.albumId as string, newValue);
                    return m;
                })
            }
        }
    }

    removeTrackById(id: string) {
        if (get(this.currentTrackStore)?.id === id) {
            this.globalAudio?.pause();
        };
        const removedTrack = get(this.trackListStore).filter((track) => track.id === id).at(0);
        if (removedTrack?.albumId) {
            this.albumTrackCountStore.update((m) => {
                const newValue = Math.max(0, (m.get(removedTrack.albumId as string) ?? 0) - 1);
                m.set(removedTrack.albumId as string, newValue);
                return m;
            })
        }
        this.trackListStore.update((trackList) => {
            return trackList.filter((track) => track.id !== id);
        })
    }


    // handlers for single audio global playback


    toggleTrackPlayback(track: TrackModel) {
        const lastPlayingTrackId = get(this.currentTrackStore)?.id;
        this.globalAudio?.pause();
        if (track?.id !== lastPlayingTrackId) {
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
            this.currentTrackStore.set(track);
            this.trackListStore.update((trackList) => trackList.map((trackItem) => {return {...trackItem, isPlaying: trackItem.id === track.id}}))
        }
        this.globalAudio.onpause = () => {
            this.globalAudio!.currentTime = 0
            this.currentTrackStore.set(undefined);
            this.trackListStore.update((trackList) => trackList.map((track) => {return {...track, isPlaying: false}}));
        };
        this.globalAudio.onended = this.globalAudio.onpause;
        this.globalAudio.play();
    }
}
