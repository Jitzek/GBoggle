<script lang="ts">
  import type { Socket } from "socket.io-client";
  import { setCookie, deleteCookie } from "@utils/cookies";

  import BasicContainer from "@components/BasicContainer.svelte";
  import { TextInput } from "@components/inputs/index";
  import UploadButton from "@components/UploadButton.svelte";
  import LinkButton from "@components/LinkButton.svelte";
  import Leaderboard from "@components/Leaderboard.svelte";
  import { navigate } from "svelte-routing";

  import {
    User,
    Users,
    Private,
    Play,
    Logout,
    Public,
    Send,
  } from "@components/svg/index";
  import Modal from "@components/Modal.svelte";

  export let socket: Socket;

  let invite_link: string;
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("invite-link")) {
    invite_link = searchParams.get("invite-link");
  }

  // Nickname
  let nickname = localStorage.getItem("nickname");
  if (!nickname) nickname = "";
  let nickname_min_length = 3;
  let nickname_max_length = 20;
  let avatar = localStorage.getItem("avatar");
  let victory_audio = localStorage.getItem("victory_audio");

  let passwordValue: string;
  let showPlayModal: boolean = false;
  let showPasswordModal: boolean = false;

  function play() {
    // Verify nickname
    if (!nicknameIsValid()) {
      alert(
        `Nickname needs to be between ${nickname_min_length}-${nickname_max_length} characters long (white space does not count for minimal length)`
      );
      return;
    }
    // Verify avatar
    avatar = localStorage.getItem("avatar");
    if (!avatar) {
      localStorage.setItem("avatar", "");
    }
    victory_audio = localStorage.getItem("victory_audio");
    // Verify victory audio
    if (!victory_audio || victory_audio.length <= 0) {
      // Keep empty (for now)
    }

    if (invite_link) {
      setCookie("room_id", invite_link);
      navigate(`/room/${invite_link}`, { replace: true });
      return;
    }

    showPlayModal = true;
  }

  function createPublicRoom() {
    // play() should have already validated data

    // Request a room from the socket
    requestPublicRoom();
  }

  function createPrivateRoom() {
    // play() should have already validated data
    // Request a room from the socket

    showPasswordModal = true;
  }

  function requestPublicRoom() {
    socket.emit("create_room", "");
  }

  function requestPrivateRoom() {
    socket.emit("create_room", passwordValue);
  }

  const passwordModalInputOnKeyPress = (e) => {
    // If enter was pressed
    if (e.charCode === 13) requestPrivateRoom();
  };

  function onNicknameBlur() {
    if (nicknameIsValid()) {
      localStorage.setItem("nickname", nickname);
    }
  }

  function nicknameIsValid(): boolean {
    return (nickname.trim().length >= nickname_min_length && nickname.length <= nickname_max_length);
  }

  socket.on("room_created", (room_id: string, user_id: string) => {
    setCookie("room_id", room_id);
    navigate(`/room/${room_id}`, { replace: true });
  });
</script>

<BasicContainer>
  <Modal id="password_modal" z_index="9999" show="{showPasswordModal}">
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
        value="Create"
        btn_background="#46a350"
        on:click="{requestPrivateRoom}"
        ><Send width="20px" color="#46a350" /></LinkButton
      >
      <div style="margin-bottom: 2rem"></div>
      <LinkButton
        on:click="{() => (showPasswordModal = false)}"
        btn_width="60%"
        value="Close"
        btn_background="#f55a42"
        ><Logout width="20px" color="#f55a42" /></LinkButton
      >
    </div>
  </Modal>
  <Modal id="play_modal" z_index="9998" show="{showPlayModal}">
    <div class="play-modal-content">
      <LinkButton
        btn_width="90%"
        value="Singleplayer"
        btn_background="#46a350"
        href="game"><User width="20px" color="#46a350" /></LinkButton
      >
      <LinkButton
        btn_width="90%"
        value="Multiplayer"
        btn_background="#2b6a34"
        href="roombrowser"><Users width="25px" color="#2b6a34" /></LinkButton
      >
      <LinkButton
        on:click="{createPublicRoom}"
        btn_width="90%"
        value="Create public room"
        btn_background="#0080ff"
        ><Public width="20px" color="#0080ff" /></LinkButton
      >
      <LinkButton
        on:click="{createPrivateRoom}"
        btn_width="90%"
        value="Create private room"
        btn_background="#13a8e0"
        ><Private width="25px" color="#13a8e0" /></LinkButton
      >

      <div style="margin-bottom: 2rem"></div>
      <LinkButton
        on:click="{() => (showPlayModal = false)}"
        btn_width="60%"
        value="Close"
        btn_background="#f55a42"
        ><Logout width="20px" color="#f55a42" /></LinkButton
      >
    </div>
  </Modal>
  <div class="start-container">
    <TextInput
      label="Nickname: "
      bind:value="{nickname}"
      minLength="3"
      maxLength="20"
      on:blur="{onNicknameBlur}"
    />
    <div class="flexthis">
      <UploadButton
        acceptedfiletypes="image/*"
        id="image"
        labelName="Upload Avatar:"
      />
      <UploadButton
        acceptedfiletypes="audio/*"
        id="audio"
        labelName="Upload victory audio:"
      />
    </div>
    <div class="buttons">
      <LinkButton
        on:click="{play}"
        value="Play"
        btn_width="80%"
        btn_background="#46a350"
        ><Play width="20px" color="#46a350" /></LinkButton
      >
    </div>
  </div>
</BasicContainer>
<BasicContainer>
  <Leaderboard />
</BasicContainer>

<style>
  .flexthis {
    display: flex;
    justify-content: space-evenly;
  }
  .start-container {
    padding: 0 2rem 0 2rem;
  }
  .buttons {
    padding: 2rem 0 2rem 0;
  }
  /* .topbuttons{
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 1rem;
    } */

  .play-modal-content {
    margin: auto;
    width: 60%;
  }

  @media screen and (max-width: 500px) {
    .play-modal-content {
      width: 100%;
    }
  }

  .password-modal-content {
    margin: auto;
    width: 50%;
    height: 100%;
  }

  @media screen and (max-width: 500px) {
    .password-modal-content {
      width: 90%;
    }
  }
</style>
