import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";
import { Album, Client } from 'spotify-api.js';

const CLIENT = new Client({
    token: {
        clientID: SPOTIFY_CLIENT_ID,
        clientSecret: SPOTIFY_CLIENT_SECRET,
    },
});

export const load = async ({ params }) => {    
    const getAlbumById = async (albumId: string) => {
        let album = await CLIENT.albums.get(albumId) as Album;
        return {
            name: album.name,
            tracks: album.tracks?.map((track) => {
                return {
                    name: track.name,
                    duration: Math.ceil(track.duration / 1000),
                    previewURL: track.previewURL,
                }
            }) as {name: string, duration: number, previewURL: string}[],
        }
    };

    return {
        album: await getAlbumById(params.albumId),
    };
};