<script lang="ts">
  import type SvelteComponentDev from "*.svelte";

  import type { SvelteComponent } from "svelte";

  import RoomSettings from "../components/RoomSettings.svelte";

  enum ROOM_STATE {
    LOBBY,
    INGAME
  }

  export let id: string;
  // TODO: Connect to the server (socket) of this room using id
  // Use localstorage to store user token

  // TODO: Use server to determine the room state
  let room_state: ROOM_STATE;

  // TEMPORARY ASSIGNMENT
  room_state = ROOM_STATE.LOBBY;
</script>

<div>
  <!-- Dependent on the state of the Game (Lobby or Ingame) load in the correct component -->
  {#if room_state === ROOM_STATE.LOBBY}
    <RoomSettings room_id="{id}" />
  {:else if room_state == ROOM_STATE.INGAME}
    <div></div>
  {/if}
</div>

<style lang="scss">
</style>
