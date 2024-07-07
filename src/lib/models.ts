export interface TrackModel {
    id: string;
    name: string;
    coverArtUrl?: string;
    artistNames: string[];
    duration: number;
    previewURL: string;
    isPlaying?: boolean;
    isDragging?: boolean;
    rankOrder?: number;
}

export interface AlbumModel {
    name: string;
    coverArtUrl?: string;
    artistNames: string[];
    trackList: TrackModel[];
}
