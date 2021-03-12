<script lang="ts">
  import RoomSettings from "../components/RoomSettings.svelte";
  import Players from "../components/Players.svelte";
  import User from "../components/svg/user.svelte";
  import SideWindow from "../components/SideWindow.svelte";

  enum ROOM_STATE {
    LOBBY,
    INGAME,
  }

  export let id: string;
  // TODO: Connect to the server (socket) of this room using id
  // Use localstorage to store user token

  // TODO: Use server to determine the room state
  let room_state: ROOM_STATE;

  // TEMPORARY ASSIGNMENT
  room_state = ROOM_STATE.LOBBY;

  let players_collapsed: boolean = true;
  let chat_collapsed: boolean = true;

  $: {
    players_collapsed;
    console.log(players_collapsed);
  }
  $: {
    chat_collapsed;
    console.log(chat_collapsed);
  }
</script>

<div class="room-container">
  <div class="players-component">
    <SideWindow
      position="left"
      button_background="#2b6a34"
      bind:collapsed="{players_collapsed}"
    >
      <div class="icon-container" slot="icon">
        <User color="#2b6a34" width="60%" />
      </div>
      <div slot="window">
        <Players room_id="{id}" />
      </div>
    </SideWindow>
  </div>
  <div class="main-component">
    <!-- Dependent on the state of the Game (Lobby or Ingame) load in the correct component -->
    {#if room_state === ROOM_STATE.LOBBY}
      <RoomSettings room_id="{id}" />
    {:else if room_state == ROOM_STATE.INGAME}
      <div></div>
    {/if}
  </div>
  <div class="chat-component"></div>
</div>

<style lang="scss">
  .icon-container {
    display: flex;
  }
</style>
