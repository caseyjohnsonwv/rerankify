<script lang="ts">
    import type { Session } from "@auth/sveltekit";
    import { signOut } from "@auth/sveltekit/client";

    export let data: Session;

    const handleSignOut = async () => {
        signOut();
    }
</script>

{#if data?.user?.name}
    <nav class="grid grid-cols-4 items-center py-2 px-8 max-h-12 bg-purple-700 text-slate-50 font-light">
        <div class="col-start-2 col-span-2 text-center">
            <span class="text-2xl font-bold italic">Rankify.</span>
        </div>
        <div class="flex flex-row items-center justify-end space-x-2 col-span-1">
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src="{data.user?.image}" alt="User's Spotify profile picture" class="max-h-8 rounded-full"/>
            <span class="font-medium">{data.user?.name}</span>
            <span>|</span>
            <button on:click={handleSignOut} class="flex flex-row items-center space-x-2 hover:text-slate-200">
                <span class="underline underline-offset-2">Sign Out</span>
                <i class="fa-solid fa-right-from-bracket"></i>
            </button>
        </div>
    </nav>
    <div class="pt-4">
        <slot/>
    </div>
{/if}