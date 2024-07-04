import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";
import { Album, Client } from 'spotify-api.js';
import { type TrackModel, type AlbumModel } from '$lib/models';

const CLIENT = new Client({
    token: {
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
    },
});

export const load = async ({ params }) => {    
    const getAlbumById = async (albumId: string): Promise<AlbumModel> => {
        const album = await CLIENT.albums.get(albumId) as Album;
        const trackList: TrackModel[] = album.tracks?.map((track) => {
            return {
                id: track.id,
                name: track.name,
                duration: Math.ceil(track.duration / 1000),
                previewURL: track.previewURL,
            };
        }) ?? [];
        const albumModel: AlbumModel = {
            name: album.name,
            trackList: trackList,
        }
        return albumModel;
    };

    return {
        album: await getAlbumById(params.albumId),
    };
};