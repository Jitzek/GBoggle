<script lang="ts">
  import Player from "@components/room/Player.svelte";
  import type { PlayersObject } from "./PlayersObject";

  export let players: PlayersObject;

</script>

<table class="players">
  {#each players.players as player}
    <Player name="{player.name}" avatar="{player.avatar}" score="{player.score}" />
  {/each}
</table>

<style lang="scss">
  .players {
    width: 100%;
  }
</style>
