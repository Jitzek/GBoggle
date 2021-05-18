<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let value: string;
  export let checked;
  export let disabled = false;
</script>

<label>
  <input
    class:disabled
    disabled={disabled}
    type="checkbox"
    value="{value}"
    bind:checked
    on:change="{() => {
      dispatch('message');
    }}"
  />
  {value}
</label>

<style>
  .disabled {
    color: rgb(140, 140, 140);
    cursor: not-allowed;
  }
</style>
