import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";
import { Album, Client, Track } from 'spotify-api.js';
import { type TrackModel, type AlbumModel } from '$lib/models';


const CLIENT = new Client({
    token: {
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
    },
});


export class SpotifyWrapper {

    // exposed methods

    async search(query: string): Promise<(TrackModel|AlbumModel)[]> {
        const res = await CLIENT.search(query, {
            types: ['album', 'track'],
            limit: 10,
        });
        const albums = res.albums?.map((album) => this.convertAlbumToAlbumModel(album)) ?? [];
        const tracks = res.tracks?.map((track) => this.convertTrackToTrackModel(track)) ?? [];
        return [...tracks, ...albums]
    }

    // private converter methods

    private convertTrackToTrackModel(track: Track): TrackModel {
        return {
            id: track.id,
            name: track.name,
            artistNames: track.artists.map((artist) => artist.name),
            coverArtUrl: track.album?.images.at(0)?.url,
            duration: Math.ceil(track.duration / 1000),
            previewURL: track.previewURL,
            isPlaying: false,
        };
    }

    private convertAlbumToAlbumModel(album: Album): AlbumModel {
        const trackList = album.tracks?.map((track) => this.convertTrackToTrackModel(track)) ?? [];
        const albumModel: AlbumModel = {
            name: album.name,
            coverArtUrl: album.images.at(0)?.url,
            artistNames: album.artists.map((artist) => artist.name),
            trackList: trackList,
        }
        return albumModel;
    }
}
