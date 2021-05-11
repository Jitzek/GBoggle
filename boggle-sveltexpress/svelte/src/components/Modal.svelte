<script lang="ts" context="module">
  let modal;

  export function show() {
    modal.style.display = "block";
  }

  export function hide() {
    modal.style.display = "none";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
</script>

<div class="modal" bind:this="{modal}">
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
    z-index: 999;
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
