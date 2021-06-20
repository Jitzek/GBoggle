<script lang="ts">
  import Player from "@components/room/Player.svelte";
  import type { Player as PlayerObject } from "../room/objects/Player";

  export let players: PlayerObject[];

</script>

<table class="players">
  {#each players as player}
    <Player name="{player.name}" avatar="{player.avatar}" score="{player.score}" />
  {/each}
</table>

<style lang="scss">
  .players {
    width: 100%;
  }
</style>
