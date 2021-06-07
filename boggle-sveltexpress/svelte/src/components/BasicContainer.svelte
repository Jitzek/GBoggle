<script lang="ts">
  export let style: string = "";
</script>

<div class="basiccontainer" style="{style}">
  <slot />
</div>

<style>
  .basiccontainer {
    background-color: rgba(255, 255, 255, 0.4);
  }
</style>
