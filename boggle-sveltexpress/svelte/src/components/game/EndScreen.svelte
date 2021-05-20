<script lang="ts">
  import Player from "@components/room/Player.svelte";
  import LinkButton from "@components/LinkButton.svelte";
  import { Logout, Send } from "@components/svg/index";
  import type { Socket } from "socket.io-client";
  import BitText from "@components/BitText.svelte";
  import UserIcon from "@components/UserIcon.svelte";
  import type { Player as PlayerObject } from "../room/objects/Player";
  import type { Room as RoomObject } from "../room/objects/Room";
  import { GameType } from "@components/room/objects/Room";

  export let room: RoomObject;
  export let players: PlayerObject[];

  let players_copy: PlayerObject[];
  let winner: PlayerObject;

  let _players_copy = [];
  players.forEach((player) => {
    _players_copy.push(Object.assign({}, player));
  });
  players_copy = _players_copy;

  // players should already be sorted
  winner = players_copy[0];
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
      {#if player.uuid !== winner.uuid}
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
  {#if room.gametype === GameType.SINGLEPLAYER}
    <LinkButton
      on:click="{() => room.submitScore()}"
      btn_width="90%"
      value="Submit Score"
      btn_background="#0080ff"><Send width="20px" color="#0080ff" /></LinkButton
    >
  {/if}
  <LinkButton
    on:click="{() => room.backToMenu()}"
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
