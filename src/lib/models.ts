export interface TrackModel {
    id: string;
    name: string;
    duration: number;
    previewURL: string;
    isPlaying?: boolean;
}

export interface AlbumModel {
    name: string;
    trackList: TrackModel[];
}
