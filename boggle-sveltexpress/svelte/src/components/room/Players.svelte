<script lang="ts">
  import type { Socket } from "socket.io-client";
  import Player from "@components/room/Player.svelte";
import Play from "../svg/play.svelte";

  export let roomId: string;
  export let socket: Socket;

  let players: Object[] = [];

  socket.on("player_joined", (id: string, name: string, avatar: string, score: number) => {
    addPlayer(id, name, avatar, score);
  });

  socket.on("player_removed", (id: string) => {
    removePlayerByID(id);
  }); 

  function addPlayer(id: string, name: string, avatar: string, score: number) {
    players.push({
      id: id,
      name: name,
      avatar: avatar,
      score: score
    });
    players = players;
  }

  function removePlayerByID (id: string) {
    players = players.filter(player => player["id"] !== id);
  }
</script>

<table class="players">
  {#each players as player}
    <Player name="{player["name"]}" avatar="{player["avatar"]}" score="{player["score"]}" />
    <!-- <svelte:component this="{Player}" objAttributes="{player}" /> -->
  {/each}
</table>

<style lang="scss">
  .players {
    width: 100%;
  }
</style>
