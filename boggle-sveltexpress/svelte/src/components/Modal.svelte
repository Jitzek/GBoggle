<script lang="ts">
  export let id: string;
  export let z_index: string;
  export let show: boolean;

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

<div id="{id}" class="modal" bind:this="{modal}" style="z-index: {z_index};">
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
    padding-top: 25vh;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.8);

    .close {
      color: #aaaaaa;
      float: left;
      font-size: 2rem;
      font-weight: bold;
      cursor: pointer;
    }
  }
</style>
