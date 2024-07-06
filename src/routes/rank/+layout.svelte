<script lang="ts">
    import type { Session } from "@auth/sveltekit";
    export let data: Session;
</script>

{#if data?.user?.name}
    <slot/>
{/if}