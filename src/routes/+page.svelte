<script lang="ts">
    import { signIn } from "@auth/sveltekit/client";

    const handleSignIn = async () => {
        signIn('spotify', {callbackUrl: '/rank'})
    }
</script>

<div class="w-1/6 mx-auto flex flex-col justify-center min-h-screen space-y-12">
    <div class="flex flex-col space-y-4 text-center">
        <h1 class="text-5xl font-bold italic">Rankify.</h1>
        <span>The better way to rank music.</span>
    </div>
    <button on:click={handleSignIn} class=" p-3 rounded-full bg-purple-700 hover:bg-purple-800 text-slate-50 hover:text-slate-200 font-bold">
        Start Ranking
    </button>
</div>
