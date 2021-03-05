<script lang="ts">
  import Chat from "../components/svg/chat.svelte"
  import User from "../components/svg/user.svelte"

  import SideWindow from "../components/SideWindow.svelte";
  export let room_id: string;
</script>

<div class="collapse-container">
  <SideWindow position="left" button_background="#2b6a34">
    <div class="icon-container" slot="icon">
      <User color="#2b6a34" width="60%" />
    </div>
    <div slot="window">
      <h1>Players</h1>
    </div>
  </SideWindow>
</div>

<style lang="scss">
  .icon-container {
    display: flex;
  }
</style>
