<script lang="ts">
  import type { Socket } from "socket.io-client";
  import Player from "@components/room/Player.svelte";
  import Play from "../svg/play.svelte";

  export let roomId: string;
  export let socket: Socket;

  let players: Object[] = [];

  socket.on("player_joined", (id: string, name: string, avatar: string, score: number, is_host: boolean) => {
    addPlayer(id, name, avatar, score, is_host);
  });

  socket.on("player_removed", (id: string) => {
    removePlayerByID(id);
  }); 

  socket.on("player_score_changed", (id: string, score: number) => {
    changeScoreOfPlayerByID(id, score);
  });

  function addPlayer(id: string, name: string, avatar: string, score: number, is_host: boolean) {
    players.push({
      id: id,
      name: name,
      avatar: avatar,
      score: score,
      is_host: is_host
    });
    updatePlayers(players);
  }

  function removePlayerByID (id: string) {
    updatePlayers(players.filter(player => player["id"] !== id));
  }

  function changeScoreOfPlayerByID(id: string, score: number) {
    console.log("changing score");
    const player = players.find(_player => _player["id"] === id);
    if (!player)
      return;
    player["score"] = score;
    updatePlayers(players);
  }

  function updatePlayers(new_players: Object[]) {
    // Order alphabetically
    new_players.sort((_p1, _p2) => (_p1["name"] as string).localeCompare(_p2["name"] as string));

    // Order by score
    new_players.sort((_p1, _p2) => {
      if (_p1["score"] == _p2["score"]) return 0;
      return _p1["score"] < _p2["score"] ? 1 : -1;
    });

    players = new_players;
  }

</script>

<table class="players">
  {#each players as player}
    <Player name="{player["name"]}" avatar="{player["avatar"]}" score="{player["score"]}" />
  {/each}
</table>

<style lang="scss">
  .players {
    width: 100%;
  }
</style>
