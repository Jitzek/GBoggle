<script lang="ts">
  import type { Socket } from "socket.io-client";

  import RoomSettings from "@components/room/RoomSettings.svelte";
  import Players from "@components/room/Players.svelte";
  import Chat from "@components/room/chat/Chat.svelte";
  import { Chat_Icon, User, Send, Logout } from "@components/svg/index";
  import SideWindow from "@components/SideWindow.svelte";
  import GamePage from "@components/game/GamePage.svelte";
  import { getCookie, deleteCookie } from "@utils/cookies";
  import Modal from "@components/Modal.svelte";
  import { TextInput } from "@components/inputs/index";
  import LinkButton from "@components/LinkButton.svelte";
  import EndScreen from "@components/game/EndScreen.svelte";
  import { navigate } from "svelte-routing";
  import {
    Room as RoomObject,
    RoomState,
  } from "../components/room/objects/Room";
  import { User as UserObject } from "../components/room/objects/User";
  import type { Player as PlayerObject } from "../components/room/objects/Player";
  import type { Game as GameObject } from "../components/room/objects/game/Game";

  export let socket: Socket;
  export let id: string;

  // Don't allow users to join without invite link (forces selection/confirmation of nickname, avatar and victory audio)
  if (getCookie("room_id") != id) {
    deleteCookie("room_id");
    location.href = `http://${window.location.host}/`;
  }

  let nickname = localStorage.getItem("nickname");
  let avatar = localStorage.getItem("avatar");
  let victory_audio = localStorage.getItem("victory_audio");

  let room: RoomObject = new RoomObject(
    socket,
    id,
    new UserObject("", nickname, avatar, victory_audio)
  );

  let game: GameObject;

  let inProgress: boolean = false;
  room.setGameStartedCallback(() => {
    game = room.game;
    inProgress = true;
  });

  room.setGameEndedCallback(() => {
    game = undefined;
    inProgress = false;
  });

  let roomState: RoomState;
  room.state.subscribe((value) => {
    roomState = value;
  });

  let players: PlayerObject[] = [];
  room.setPlayersChangedCallback((newPlayers: PlayerObject[]) => {
    players = newPlayers;
  });

  let passwordValue: string;
  room.setIncorrectPasswordCallback(() => {
    passwordValue = "";
  });

  let connected = false;
  room.setConnectionStatusChangedCallback((_connected: boolean) => {
    connected = _connected;
  });

  let passwordProtected = false;
  room.passwordProtected.subscribe((value) => {
    passwordProtected = value;
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
    if (e.charCode === 13) room.join(passwordValue);
  };
</script>

<Modal
  id="password_modal"
  show="{passwordProtected === true && connected === false}"
  z_index="{9}"
>
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
      on:click="{() => room.join(passwordValue)}"
      ><Send width="20px" color="#46a350" /></LinkButton
    >
    <div style="margin-bottom: 2rem"></div>
    <LinkButton
      on:click="{() => navigate('/', { replace: true })}"
      btn_width="60%"
      value="Close"
      btn_background="#f55a42"
      ><Logout width="20px" color="#f55a42" /></LinkButton
    >
  </div>
</Modal>
<Modal
  id="endscreen_modal"
  show="{roomState === RoomState.INGAME && !inProgress}"
  padding_top="10vh"
  z_index="{9}"
>
  <div class="endscreen-modal-content">
    <EndScreen room="{room}" players="{players}" />
  </div>
</Modal>
{#if connected}
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
          <Chat room="{room}" />
        </div>
      </SideWindow>
    </div>
    <div class="main-component">
      <!-- Dependent on the state of the Game (Lobby or Ingame) load in the correct component -->
      {#if roomState === RoomState.LOBBY}
        <RoomSettings room="{room}" />
      {:else if roomState == RoomState.INGAME}
        <div><GamePage game="{game}" /></div>
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
