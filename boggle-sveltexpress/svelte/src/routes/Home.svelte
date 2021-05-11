<script lang="ts">
  import BasicContainer from "@components/BasicContainer.svelte";
  import { TextInput } from "@components/inputs/index";
  import UploadButton from "@components/UploadButton.svelte";
  import LinkButton from "@components/LinkButton.svelte";
  import Leaderboard from "@components/Leaderboard.svelte";
  import { User, Users, Private, Play, Logout } from "@components/svg/index";
  import Modal, { show, hide } from "@components/Modal.svelte";

  export let invite_link: string;

  let nickname = localStorage.getItem("nickname");
  let avatar = localStorage.getItem("avatar");
  let victory_audio;

  function play() {
    // Verify nickname, avatar and victory audio

    // Save data to localstorage
    localStorage.setItem("nickname", nickname);

    if (invite_link) {
        location.href = `http://localhost:8000/room/${invite_link}`;
        return;
    }
    show();
  }
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
        btn_width="90%"
        value="Create private room"
        btn_background="#13a8e0"
        ><Private width="25px" color="#13a8e0" /></LinkButton
      >

      <div style="margin-bottom: 2rem"></div>
      <LinkButton on:click="{hide}" btn_width="60%" value="Close" btn_background="#f55a42"
        ><Logout width="20px" color="#f55a42" /></LinkButton
      >
    </div>
  </Modal>
  <div class="start-container">
    <TextInput label="Nickname: " bind:value="{nickname}" minLength="3" maxLength="20" />
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
