<script lang="ts">
  import type { Socket } from "socket.io-client";

  import RoomSettings from "@components/room/RoomSettings.svelte";
  import Players from "@components/room/Players.svelte";
  import Chat from "@components/room/chat/Chat.svelte";
  import { Chat_Icon, User, Send } from "@components/svg/index";
  import SideWindow from "@components/SideWindow.svelte";
  import GamePage from "@components/game/GamePage.svelte";
  import { getCookie, deleteCookie } from "@utils/cookies";
  import Modal from "@components/Modal.svelte";
  import { TextInput } from "@components/inputs/index";
  import LinkButton from "@components/LinkButton.svelte";
  import EndScreen from "@components/game/EndScreen.svelte";
  import { PlayersObject } from "@components/room/PlayersObject";

  enum ROOM_STATE {
    LOBBY,
    INGAME,
  }

  export let socket: Socket;
  export let id: string;

  let user_uuid: string;

  let isHost = false;
  let is_connected = false;

  // Don't allow users to join without invite link (forces selection/confirmation of nickname, avatar and victory audio)
  if (getCookie("room_id") != id) {
    deleteCookie("room_id");
    location.href = `http://${window.location.host}/`;
  }

  let passwordValue: string;

  let nickname = localStorage.getItem("nickname");
  let avatar = localStorage.getItem("avatar");
  let victory_audio = localStorage.getItem("victory_audio");
  let room_state = ROOM_STATE.LOBBY;
  let is_singleplayer = false;

  let showPasswordModal = false;

  // Check if room exists
  socket.emit("room_information", id);
  socket.on(
    "room_information",
    (
      room_exists: boolean,
      room_is_password_protected: boolean,
      user_is_host: boolean,
      room_is_singleplayer: boolean
    ) => {
      if (!room_exists) {
        // Room doesn't exist
        // TODO: notify user
        window.location.href = `http://${window.location.host}/`;
      }
      is_singleplayer = room_is_singleplayer;
      isHost = user_is_host;
      if (room_is_password_protected && !user_is_host) {
        // Request password
        console.log("password required");
        showPasswordModal = true;
        return;
      }
      // Request connection to room
      join_room("");
      return;
    }
  );

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
    passwordValue = "";
  });

  socket.on("invalid_name", (reason: string) => {
    alert(`Invalid name, reason: ${reason}`);
    location.href = `http://${location.host}/`;
  });

  socket.on("invalid_avatar", (reason: string) => {
    alert(`Invalid avatar, reason: ${reason}`);
    location.href = `http://${location.host}/`;
  });

  socket.on("invalid_victory_audio", (reason: string) => {
    alert(`Invalid victory audio, reason: ${reason}`);
    location.href = `http://${location.host}/`;
  });

  socket.on("disconnected", (reason: string) => {
    console.log(`disconnected with reason: ${reason}`);
  });

  socket.on("message", (message: string) => {
    console.log(`received message: ${message}`);
  });

  socket.on("joined", (uuid: string) => {
    console.log("succesfully joined");
    is_connected = true;
    showPasswordModal = false;
    user_uuid = uuid;
  });

  socket.on("game_started", () => {
    console.log("game started");
    showEndscreenModal = false;
    room_state = ROOM_STATE.INGAME;
  });

  let playing_victory_audio = new Audio();
  let showEndscreenModal = false;
  socket.on("game_ended", (victory_audio: string) => {
    console.log("Game ended");
    playing_victory_audio = new Audio(victory_audio);
    playing_victory_audio.volume = 0.5;
    showEndscreenModal = true;
    setTimeout(() => {
      playing_victory_audio.play();
    }, 1000);
  });

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

  const passwordModalInputOnKeyPress = (e) => {
    // If enter was pressed
    if (e.charCode === 13) join_room(passwordValue);
  };

  function join_room(password: string) {
    socket.emit("join_room", id, nickname, avatar, victory_audio, password);
  }

  let players = new PlayersObject();
  socket.on(
    "player_joined",
    (
      _id: string,
      _name: string,
      _avatar: string,
      _score: number,
      _is_host: boolean
    ) => {
      players.addPlayer(_id, _name, _avatar, _score, _is_host);
      players = players;
    }
  );

  socket.on("player_removed", (id: string) => {
    players.removePlayerByID(id);
    players = players;
  });

  socket.on("player_score_changed", (id: string, score: number) => {
    players.changeScoreOfPlayerByID(id, score);
    players = players;
  });

  function backToMenu() {
    // Stop victory audio from playing
    playing_victory_audio.pause();
    playing_victory_audio = new Audio();
    showEndscreenModal = false;
    room_state = ROOM_STATE.LOBBY;
  }
</script>

<Modal id="password_modal" show="{showPasswordModal}" z_index={9}>
  <div class="password-modal-content">
    <TextInput
      label="Password: "
      bind:value="{passwordValue}"
      minLength="1"
      type="password"
      on:keypress="{passwordModalInputOnKeyPress}"
    />
    <LinkButton
      btn_width="80%"
      value="Join"
      btn_background="#46a350"
      on:click="{() => join_room(passwordValue)}"
      ><Send width="20px" color="#46a350" /></LinkButton
    >
  </div>
</Modal>
{#if showEndscreenModal}
  <Modal id="endscreen_modal" show="{showEndscreenModal}" padding_top="10vh" z_index={9}>
    <div class="endscreen-modal-content">
      <EndScreen players="{players}" backToMenu="{backToMenu}" socket="{socket}" singleplayer="{is_singleplayer}" />
    </div>
  </Modal>
{/if}
{#if is_connected}
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
          <Players players="{players}" />
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
          <Chat socket="{socket}" players="{players}"/>
        </div>
      </SideWindow>
    </div>
    <div class="main-component">
      <!-- Dependent on the state of the Game (Lobby or Ingame) load in the correct component -->
      {#if room_state === ROOM_STATE.LOBBY}
        <RoomSettings roomId="{id}" isHost="{isHost}" socket="{socket}" singleplayer="{is_singleplayer}" />
      {:else if room_state == ROOM_STATE.INGAME}
        <div><GamePage socket="{socket}" uuid="{user_uuid}" /></div>
      {/if}
    </div>
    <div class="chat-component"></div>
  </div>
{:else}
  <!-- Not connected -->
  <h1>Not connected to room</h1>
{/if}

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

  .password-modal-content {
    margin: auto;
    width: 50%;
    height: 100%;
  }

  .endscreen-modal-content {
    margin: auto;
    width: 50%;
    height: 100%;
  }

  @media screen and (max-width: 500px) {
    .password-modal-content {
      width: 90%;
    }
    .endscreen-modal-content {
      width: 90%;
    }
  }
</style>
