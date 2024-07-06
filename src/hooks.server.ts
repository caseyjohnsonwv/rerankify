import { SvelteKitAuth } from "@auth/sveltekit"
import Spotify from "@auth/sveltekit/providers/spotify";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";
 
export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [
        Spotify({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
        })
    ],
});
