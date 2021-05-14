<script lang="ts">
  import Player from "@components/room/Player.svelte";
  import type { PlayersObject } from "../room/PlayersObject";
  import type { PlayerObject } from "../room/PlayerObject";
  import LinkButton from "@components/LinkButton.svelte";
  import { Logout } from "@components/svg/index";
  export let players: PlayersObject;
  export let backToMenu: Function;

  import BitText from "@components/BitText.svelte";
  import UserIcon from "@components/UserIcon.svelte";

  // players should already be sorted
  let winner: PlayerObject;

  $: {
    players;
    winner = players.players[0];
  }
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
    {#each players.players as player, i}
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
  <LinkButton
    on:click="{() => (backToMenu())}"
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
