import { SpotifyWrapper } from '$lib/spotify.js';


const spotifyWrapper = new SpotifyWrapper();


export const load = async ({ params }) => {    
    return {
        album: await spotifyWrapper.getAlbumById(params.albumId),
    };
};