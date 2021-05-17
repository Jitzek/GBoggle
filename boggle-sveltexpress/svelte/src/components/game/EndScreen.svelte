<script lang="ts">
  import Player from "@components/room/Player.svelte";
  import type { PlayersObject } from "../room/PlayersObject";
  import type { PlayerObject } from "../room/PlayerObject";
  import LinkButton from "@components/LinkButton.svelte";
  import { Logout, Send } from "@components/svg/index";
  import type { Socket } from "socket.io-client";
  import BitText from "@components/BitText.svelte";
  import UserIcon from "@components/UserIcon.svelte";

  export let socket: Socket
  export let players: PlayersObject;
  export let singleplayer: boolean = false;
  export let backToMenu: Function;

  // players should already be sorted
  let winner: PlayerObject = players.players[0];
  let players_copy: PlayerObject[] = [];
  players.players.forEach((player) => {
    players_copy.push(player);
  });

  function submit_score() {
    socket.emit("submit_score");
  }

  socket.on("score_submitted", (success: boolean) => {
    console.log(success);
    backToMenu();
  });
</script>

<div class="endscreen-container">
  <div class="winner-block">
    {#if winner}
      <UserIcon
        src="{winner.avatar}"
        size="7.5rem"
        background="#ffae00"
        border_color="#ffae00"
      />
      <h1>{winner.name}</h1>
      <BitText
        color="#fff"
        fontSize="2.2rem"
        value="{winner.score.toString()}"
      />
    {/if}
  </div>

  <table class="players-table">
    {#each players_copy as player}
      {#if player.id !== winner.id}
        <Player
          name="{player.name}"
          avatar="{player.avatar}"
          score="{player.score}"
          score_color="#fff"
          name_color="#fff"
        />
      {/if}
    {/each}
  </table>
  <div style="margin-bottom: 2rem"></div>
  {#if singleplayer}
    <LinkButton
      on:click="{submit_score}"
      btn_width="90%"
      value="Submit Score"
      btn_background="#0080ff"
      ><Send width="20px" color="#0080ff" /></LinkButton
    >
  {/if}
  <LinkButton
    on:click="{() => backToMenu()}"
    btn_width="90%"
    value="Back To Menu"
    btn_background="#13a8e0"><Logout width="20px" color="#13a8e0" /></LinkButton
  >
</div>

<style lang="scss">
  .endscreen-container {
    width: 100%;
    height: 100%;

    .winner-block {
      width: 100%;
      display: block;

      h1 {
        color: #fff;
        margin: 0;
        margin-top: 1rem;
      }
    }

    .players-table {
      width: 100%;
    }
  }
</style>
