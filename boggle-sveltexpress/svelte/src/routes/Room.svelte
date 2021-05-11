<script lang="ts">
  import { io } from "socket.io-client";

  import RoomSettings from "@components/room/RoomSettings.svelte";
  import Players from "@components/room/Players.svelte";
  import Chat from "@components/room/chat/Chat.svelte";
  import { Chat_Icon, User } from "@components/svg/index";
  import SideWindow from "@components/SideWindow.svelte";
  import GamePage from "@components/game/GamePage.svelte";
  import { getCookie, deleteCookie } from "@utils/cookies";

  enum ROOM_STATE {
    LOBBY,
    INGAME,
  }

  export let id: string;

  if (getCookie("room_id") != id) {
    deleteCookie("room_id");
    location.href = `http://${window.location.host}/`;
  }

  let nickname = localStorage.getItem("nickname");
  let avatar = localStorage.getItem("avatar");
  let victory_audio = localStorage.getItem("victory_audio");

  // TODO: Connect to the server (socket) of this room using id
  const socket = io("http://localhost:8000");

  socket.on("connect", () => {
    console.log("connected");

    // Check if room exists
    socket.emit("room_information", id);
    socket.on("room_information", (room_exists: boolean, room_is_password_protected: boolean) => {
      if (!room_exists) {
        // Room doesn't exist
        // TODO: notify user
        window.location.href = `http://${window.location.host}/`;
      }
      if (room_is_password_protected) {
        // Request password
        console.log("password required");
        return;
      }
      // Request connection to room
      socket.emit("join_room", id, nickname, avatar, victory_audio, "");
      return;
    });

    socket.on("kick", (player_id: string, reason: string) => {
      console.log(`${player_id} kicked from room with reason: ${reason}`);
      if (player_id == socket.id) {
        deleteCookie("room_id");
        window.location.href = `http://${window.location.host}/`;
      }
    });

    socket.on("incorrect_password", () => {
      // Retry password
      console.log("password was incorrect");
    });
  });

  socket.on("disconnected", (reason: string) => {
    console.log(`disconnected with reason: ${reason}`);
  });

  socket.on("message", (message: string) => {
    console.log(`received message: ${message}`);
  });

  // Use cookie to store user token (for this session)

  // TODO: Use server to determine the room state
  let room_state: ROOM_STATE;

  // TEMPORARY ASSIGNMENT
  room_state = ROOM_STATE.LOBBY;

  let players_collapsed: boolean = true;
  let chat_collapsed: boolean = true;
  let players_invisible: boolean = false;
  let chat_invisible: boolean = false;

  $: {
    players_collapsed;
    chat_invisible = !players_collapsed && chat_collapsed;
  }
  $: {
    chat_collapsed;
    players_invisible = !chat_collapsed && players_collapsed;
  }
</script>

<div class="room-container">
  <div class="players-component" class:players_invisible>
    <SideWindow
      position="left"
      buttonBackground="#2b6a34"
      iconBackground="#fff"
      bind:collapsed="{players_collapsed}"
    >
      <div class="icon-container" slot="icon">
        <User color="#2b6a34" width="60%" />
      </div>
      <div slot="window">
        <Players roomId="{id}" socket="{socket}" />
      </div>
    </SideWindow>
  </div>
  <div class="chat-component" class:chat_invisible>
    <SideWindow
      position="right"
      buttonBackground="#7f3f98"
      iconBackground="#fff"
      bind:collapsed="{chat_collapsed}"
    >
      <div class="icon-container" slot="icon">
        <Chat_Icon color="#7f3f98" width="60%" />
      </div>
      <div slot="window">
        <Chat roomId="{id}" />
      </div>
    </SideWindow>
  </div>
  <div class="main-component">
    <!-- Dependent on the state of the Game (Lobby or Ingame) load in the correct component -->
    {#if room_state === ROOM_STATE.LOBBY}
      <RoomSettings roomId="{id}" />
    {:else if room_state == ROOM_STATE.INGAME}
      <div><GamePage /></div>
    {/if}
  </div>
  <div class="chat-component"></div>
</div>

<style lang="scss">
  .icon-container {
    display: flex;
  }

  $fade_animation_duration: 0.5s;
  .players-component,
  .chat-component {
    -webkit-transition: visibility 0s,
      opacity $fade_animation_duration ease-in-out;
    -moz-transition: visibility 0s, opacity $fade_animation_duration ease-in-out;
    -ms-transition: visibility 0s, opacity $fade_animation_duration ease-in-out;
    -o-transition: visibility 0s, opacity $fade_animation_duration ease-in-out;
    transition: visibility 0s, opacity $fade_animation_duration ease-in-out;
  }

  @media only screen and (max-width: 850px) {
    .players_invisible {
      opacity: 0;
      visibility: hidden;
    }

    .chat_invisible {
      opacity: 0;
      visibility: hidden;
    }
  }
</style>
