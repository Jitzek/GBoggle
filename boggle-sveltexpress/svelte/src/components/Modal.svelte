<script lang="ts">
  export let id: string;
  export let z_index: number = 9;
  export let show: boolean;

  export let padding_top = "25vh"

  let modal: HTMLDivElement;

  $: {
    show;
    if (modal) {
      show ? show_modal() : hide_modal();
    }
  }

  function show_modal() {
    modal.style.display = "block";
  }

  function hide_modal() {
    modal.style.display = "none";
  }
</script>

<div id="{id}" class="modal" bind:this="{modal}" style="z-index: {z_index}; padding-top: {padding_top}">
  <div class="modal-content">
    <!-- <span class="close" on:click="{hide}">&times;</span> -->
    <div style="padding-bottom: 3.5rem;"></div>
    <slot />
  </div>
</div>

<style lang="scss">
  .modal {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);
  }
</style>
