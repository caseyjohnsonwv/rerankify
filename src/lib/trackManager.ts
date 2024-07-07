import { type TrackModel } from "./models";
import { writable, type Writable } from "svelte/store";

export class TrackManager {
    private globalAudio: HTMLAudioElement | undefined;
    private currentTrackId: string | undefined;
    trackListStore: Writable<TrackModel[]>;

    constructor(trackList: TrackModel[]) {
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
        if (this.currentTrackId === id) this.toggleTrack(id);
        this.trackListStore.update((trackList) => {
            return trackList.filter((track) => track.id !== id);
        })
    }


    // handlers for single audio global playback


    isCurrentTrackId(id: string): boolean {
        return this.currentTrackId === id;
    }

    toggleTrack(id: string) {
        this.globalAudio?.pause();

        this.trackListStore.update((trackList) => {
            const requestedTrack = trackList.filter((track) => track.id === id).at(0) as TrackModel;
            // handle playback of selected track
            if (this.currentTrackId === id) {
                this.currentTrackId = undefined;
            }
            else {
                this.currentTrackId = requestedTrack.id;
                this.initAudio(requestedTrack.previewURL);
            }
            // return with updated props
            return trackList.map((track) => track.id === this.currentTrackId
                ? {...track, isPlaying: true}
                : {...track, isPlaying: false}
            );
        });
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


    private initAudio(src:string) {
        this.globalAudio = new Audio(src);
        this.globalAudio.onpause = () => {
            this.globalAudio!.currentTime = 0
        };
        this.globalAudio.onended = () => {
            this.globalAudio!.currentTime = 0
            this.trackListStore.update((trackList) => trackList.map((track) => {return {...track, isPlaying: false}}));
        };
        this.globalAudio.play();
    }
}
