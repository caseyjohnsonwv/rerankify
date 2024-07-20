import { globalDraggingManager } from "./draggingManager";
import { type TrackModel } from "./models";
import { writable, get, type Writable } from "svelte/store";


export class TrackManager {
    private globalAudio: HTMLAudioElement | undefined;
    currentTrackStore: Writable<TrackModel | undefined>;
    trackListStore: Writable<TrackModel[]>;
    albumTrackCountStore: Writable<Map<string, number>>;

    constructor() {
        // initializers
        this.currentTrackStore = writable(undefined);
        this.trackListStore = writable([]);
        this.albumTrackCountStore = writable(new Map());
    }


    // handlers for adding and removing tracks


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

    // removeAllNonCanvasTracks() {
    //     this.globalAudio?.pause();
    //     this.trackListStore.update((trackList) => {
    //         const newTrackList: TrackModel[] = [];
    //         trackList.forEach((track) => {
    //             if (track.canvasX && track.canvasY) {
    //                 newTrackList.push(track)
    //             }
    //             else {
    //                 this.albumTrackCountStore.update((m) => {
    //                     const newValue = Math.max(0, (m.get(track.albumId as string) ?? 0) - 1);
    //                     m.set(track.albumId as string, newValue);
    //                     return m;
    //                 })
    //             }
    //         })
    //         return newTrackList;
    //     })
    // }


    // handlers for canvas


    moveTrackToCanvasLocationById(id: string, event: DragEvent, dragOffset?: {x:number, y:number}): {x: number, y: number} {
        let newX = Math.max(event.clientX - (dragOffset?.x ?? 0), globalDraggingManager.canvasMinX + 5);
        let newY = Math.max(event.clientY - (dragOffset?.y ?? 0), globalDraggingManager.canvasMinY + 5);
        this.trackListStore.update((trackList) => {
            return trackList.map((track) => track.id === id
                ? {...track, canvasX: newX, canvasY: newY}
                : track
            );
        });
        return {x: newX, y: newY};
    }

    removeTrackFromCanvasById(id: string) {
        this.trackListStore.update((trackList) => {
            return trackList.map((track) => track.id === id
                ? {...track, canvasX: undefined, canvasY: undefined}
                : track
            );
        });
    }


    // handlers for single audio global playback


    toggleTrackPlayback(track: TrackModel) {
        const lastPlayingTrackId = get(this.currentTrackStore)?.id;
        this.globalAudio?.pause();
        if (track?.id !== lastPlayingTrackId) {
            this.initAudio(track);
        }
    }


    stopPlayback() {
        this.globalAudio?.pause();
        this.currentTrackStore.set(undefined);
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


export const globalTrackManager = new TrackManager();
