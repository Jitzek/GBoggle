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
  } from "@components/svg/index";
  import Modal, { show, hide } from "@components/Modal.svelte";

  export let socket: Socket;

  let invite_link: string;
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has("invite-link")) {
    invite_link = searchParams.get("invite-link");
  }

  // Nickname
  let nickname = localStorage.getItem("nickname");
  let nickname_min_length = 3;
  let nickname_max_length = 20;

  let avatar = localStorage.getItem("avatar");
  let victory_audio = localStorage.getItem("victory_audio");

  function play() {
    deleteCookie("io");
    // Verify nickname
    if (
      nickname.trim().length < nickname_min_length ||
      nickname.trim().length > nickname_max_length
    ) {
      alert(
        "Nickname needs to be between 3-20 characters long (white space does not count)"
      );
      return;
    }
    // Verify avatar
    if (!avatar || avatar.length <= 0) {
      // Fall back to a default avatar
      localStorage.setItem(
        "avatar",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAY4AAAIACAYAAACVVotJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAcEAAAHBAHVcLm9AAAmDUlEQVR42u3debgkdX3v8fd3YGDYQaKAiiggiyKoIKggKuI1UdHEuEQjaFxi4h6vJmrMo7mJxAS3XI0rJgpiBBI1uVdjogkRDWh0QNwQ1LgiBkGRXVm++aMaGGY5p6tPd3+rqt+v55nHEeac+Zymqz/9+327qgJpwDLz9sB+wJ7ADsC2wHajXxv7/br/LIArR7+uWu9/N/b7K4DvAF+PiIurf3ZpVqI6gLRSmbmaphj2G/3ad53f71QU6wrgAuDro183//6bEfHz6sdMWgmLQ72SmTsDDwEO5daC2AvYvDrbmG5ktCqhKZMvAGdExI+qg0njsjjUaZm5A3AkcBTwUOBAhvm8PR84A/g34FMRcWl1IGlThngAqscyc1vgCJqSOAq4D7BZda55PwzAl2lK5AzgzIi4vDqUdDOLQ+Uy8yDg8TRFcSj92Xaal5uAc2hK5EMR8dnqQFpsFodKZOauwG8Cx9FsP2l8FwInAydHxHerw2jxWByam8zcCvhVmrJ4OIu3BTVtCZwJnAScHhFXVgfSYrA4NFOZGTTD7eNotqO2r840UNcCH6EpkU9ExI3VgTRcFodmIjPvCjwTOBbYozrPgrkY+ADwnog4vzqMhsfi0FRl5v7AK4An45C7WgIfBl4bEedUh9FwWByaisy8D/BK4HHAquo82sDHaQrkM9VB1H8Wh1YkMx8I/CHwyOosGsunaArkE9VB1F8WhyaSmQ+jKYyHVmfRRD4PvBb4x4jI6jDqF4tDrWTmMTSFcVh1Fk3Fl4HjgdMi4qbqMOoHi0NjycwDgL"
      );
    }
    // Verify victory audio
    if (!victory_audio || victory_audio.length <= 0) {
      // Keep empty (for now)
    }

    // Save data to localstorage
    localStorage.setItem("nickname", nickname);

    if (invite_link) {
      setCookie("room_id", invite_link);
      location.href = `http://${window.location.host}/room/${invite_link}`;
      return;
    }
    show();
  }

  function createPublicRoom() {
    // play() should have already validated data

    // Request a room from the socket
    socket.emit("create_room", nickname, avatar, victory_audio, "");
  }

  function createPrivateRoom() {
    // play() should have already validated data
    // Request a room from the socket
  }

  socket.on("room_created", (room_id: string, user_id: string) => {
    setCookie("room_id", room_id);
    setCookie("io", user_id);
    // location.href = `http://${window.location.host}/room/${room_id}`;
    navigate(`/room/${room_id}`, { replace: true });
  });
</script>

<BasicContainer>
  <Modal>
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
        btn_width="90%"
        value="Create private room"
        btn_background="#13a8e0"
        ><Private width="25px" color="#13a8e0" /></LinkButton
      >

      <div style="margin-bottom: 2rem"></div>
      <LinkButton
        on:click="{hide}"
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
    <!--
            <div class="buttons">
                <div class="topbuttons">
                    <LinkButton btn_width="45%" value="Singleplayer" btn_background="#46a350" href="game"><User width="20px" color="#46a350" /></LinkButton>
                    <LinkButton btn_width="45%" value="Multiplayer" btn_background="#2b6a34" href="roombrowser"><Users width="25px" color="#2b6a34" /></LinkButton>
                </div>
                <div class="bottombutton">
                    <LinkButton btn_width="80%" value="Create private room"btn_background="#13a8e0"><Private width="25px" color="#13a8e0"/></LinkButton>
                </div>
            </div>
            -->
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
</style>
