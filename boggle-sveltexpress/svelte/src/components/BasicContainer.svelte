<script lang="ts">
    export let style: string;
</script>

<div class="basiccontainer" style="{style}">
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