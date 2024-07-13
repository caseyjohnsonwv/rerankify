<script lang="ts">
    import { signOut } from "@auth/sveltekit/client";
    import type { Session } from "@auth/sveltekit";

    export let userProps: Session;

    const handleSignOut = async () => {
        signOut();
    }
</script>

<nav class="grid grid-cols-4 items-center px-8 max-h-12 bg-purple-700 text-slate-50 border-b border-b-stone-500">
    <div class="col-start-2 col-span-2 text-center p-2">
        <span class="text-2xl font-bold italic">Rankify.</span>
    </div>
    <div class="col-span-1 flex flex-row items-center justify-end space-x-2 p-2">
        <img src="{userProps.user?.image}" alt="" class="max-h-8 rounded-full"/>
        <span class="font-medium">{userProps.user?.name}</span>
        <span>|</span>
        <button on:click={handleSignOut} class="flex flex-row items-center space-x-2 hover:text-slate-200 font-light">
            <span class="underline underline-offset-2">Sign Out</span>
            <i class="fa-solid fa-right-from-bracket"></i>
        </button>
    </div>
</nav>
