import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";
import { SpotifyApi, type SimplifiedAlbum, type Track } from "@spotify/web-api-ts-sdk";
import { type TrackModel, type AlbumModel, type SearchResult, type TracksByAlbumIdResult } from '$lib/models';


const CLIENT = SpotifyApi.withClientCredentials(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);


export class SpotifyWrapper {

    // exposed methods

    async search(query: string): Promise<SearchResult> {
        const res = await CLIENT.search(query, ['album', 'track'], undefined, 20);
        const albums = res.albums.items.map((album) => this.convertAlbumToAlbumModel(album)) ?? [];
        const tracks = res.tracks.items.map((track) => this.convertTrackToTrackModel(track)) ?? [];
        return {
            albums: albums,
            tracks: tracks,
        }
    }
    
    async getTracksByAlbumId(albumId: string): Promise<TracksByAlbumIdResult> {
        const simplifiedTracks = await CLIENT.albums.tracks(albumId, undefined, 50);
        const trackPromises = simplifiedTracks.items.map((simplifiedTrack) => CLIENT.tracks.get(simplifiedTrack.id));
        const tracks = await Promise.all(trackPromises);
        const trackList = tracks.map((track) => {
            const trackModel = this.convertTrackToTrackModel(track);
            return trackModel
        })
        return {trackList: trackList}
    }

    // private converter methods

    private convertTrackToTrackModel(track: Track): TrackModel {
        return {
            id: track.id,
            name: track.name,
            albumId: track.album.id,
            artistNames: track.artists.map((artist) => artist.name),
            coverArtUrl: track.album?.images.at(0)?.url,
            duration: Math.ceil(track.duration_ms / 1000),
            previewURL: track.preview_url ?? undefined,
        };
    }

    private convertAlbumToAlbumModel(album: SimplifiedAlbum): AlbumModel {
        let releaseYear = album.release_date.match(/\d{4}/)?.at(0);
        const albumModel: AlbumModel = {
            id: album.id,
            name: album.name,
            type: album.album_type,
            coverArtUrl: album.images.at(0)?.url,
            artistNames: album.artists.map((artist) => artist.name),
            trackCount: album.total_tracks,
            releaseYear: releaseYear ? parseInt(releaseYear) : undefined,
        }
        return albumModel;
    }
}
