<script lang="ts">
  import RoomSettings from "../components/RoomSettings.svelte";
  import Players from "../components/Players.svelte";

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
</script>

<div class="room-container">
  <div class="players-component">
    <Players room_id="{id}" />
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
</style>
