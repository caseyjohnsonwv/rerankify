import { SpotifyWrapper } from '$lib/spotify';
import { json, type RequestHandler } from '@sveltejs/kit';

const spotifyWrapper = new SpotifyWrapper();

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const results = await spotifyWrapper.search(data.query)
    return json(results);
}
