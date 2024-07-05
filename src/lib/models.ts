export interface TrackModel {
    id: string;
    name: string;
    duration: number;
    previewURL: string;
    isPlaying?: boolean;
    isDragging?: boolean;
    rankOrder?: number;
}

export interface AlbumModel {
    name: string;
    trackList: TrackModel[];
}
