import type { Session } from '@auth/sveltekit';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoadEvent } from './$types';

export const load = async (event: LayoutServerLoadEvent): Promise<Session> => {
    const session = await event.locals.auth();
    if (!session) throw redirect(303, '/');
    return session;
};
