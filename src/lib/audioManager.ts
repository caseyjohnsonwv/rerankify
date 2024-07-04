import { type TrackModel } from "./models";
import { writable, type Writable } from "svelte/store";

export class AudioManager {
    private globalAudio: HTMLAudioElement | undefined;
    private currentTrackId: string | undefined;
    trackListStore: Writable<TrackModel[]>;

    constructor(trackList: TrackModel[]) {
        this.trackListStore = writable<TrackModel[]>(trackList);
    }

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

    private initAudio(src:string) {
        this.globalAudio = new Audio(src);
        this.globalAudio.onpause = () => this.globalAudio!.currentTime = 0;
        this.globalAudio.onended = () => this.globalAudio!.currentTime = 0;
        this.globalAudio.play();
    }
}
