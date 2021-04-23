<script lang="typescript">
    export let borders: Boolean = false; 
</script>

{#if borders}
<div class="basiccontainer border">
    <slot></slot>
</div>
{:else}
<div class="basiccontainer">
    <slot></slot>
</div>
{/if}
<style>
.basiccontainer{
    background-color: rgba(255, 255, 255, 0.400);
}
.border{
    border-top: 1px solid rgba(255, 255, 255, 0.400);
    border-bottom: 1px solid rgba(255, 255, 255, 0.400);
}
</style>