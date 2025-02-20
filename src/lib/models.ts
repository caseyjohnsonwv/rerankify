export interface TrackModel {
    id: string;
    name: string;
    albumId?: string;
    coverArtUrl?: string;
    artistNames: string[];
    duration: number;
    previewURL?: string;
    isPreview?: boolean;
    isPlaying?: boolean;
    canvasX?: number;
    canvasY?: number;
}

export interface AlbumModel {
    id: string;
    name: string;
    type: string;
    coverArtUrl?: string;
    artistNames: string[];
    trackCount: number;
    releaseYear?: number;
}

export interface SearchResult {
    albums: AlbumModel[],
    tracks: TrackModel[],
}

export interface TracksByAlbumIdResult {
    trackList: TrackModel[],
}
