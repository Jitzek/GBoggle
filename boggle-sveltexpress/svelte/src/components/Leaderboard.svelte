<script lang="typescript">
  import * as _ from "lodash";
  import BitText from "@components/BitText.svelte";
  import LeaderboardRow from "@components/LeaderboardRow.svelte";
  import type { PlayerScores } from "../types/Types";
  import { onMount } from "svelte";

  // Start and End index for highscores to display
  let start = 0;
  let end = 9;

  onMount(async () => {
    await requestHighScores();
  });

  let playerScores: PlayerScores[] = [];

  async function requestHighScores() {
    const response = await fetch(
      `http://localhost:3000/highscores?start=${start}&end=${end}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log("Failed to get highscore data");
      return;
    }
    if (data["success"] === false) {
      console.log(
        `Failed to get highscore data with reason: ${data["reason"]}`
      );
    }
    playerScores = data["values"];
  }
</script>

<div>
  <div class="leaderboardtitlecontainer">
    <BitText ref="leaderboardtitle" fontSize="none" value="Leaderboard" />
  </div>
  <div class="leaderbordrows">
    {#each playerScores as playerScore, i}
      <LeaderboardRow
        placement="{i + 1}"
        name="{playerScore.name}"
        score="{playerScore.score}"
        avatarpath="{playerScore.avatar}"
      />
    {/each}
  </div>
</div>

<style>
  .leaderboardtitlecontainer {
    padding: 20px 0 20px 0;
    margin-top: 20px;
  }
  .leaderbordrows {
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 50vh;
  }
  :global([ref="leaderboardtitle"]) {
    font-size: 4vw;
  }
  @media only screen and (max-width: 1200px) {
    :global([ref="leaderboardtitle"]) {
      font-size: 5vw;
    }
  }
  @media only screen and (max-width: 700px) {
    :global([ref="leaderboardtitle"]) {
      font-size: 7vw;
    }
  }
  @media only screen and (max-width: 400px) {
    :global([ref="leaderboardtitle"]) {
      font-size: 7vw;
    }
  }
  @media only screen and (max-width: 350px) {
    :global([ref="leaderboardtitle"]) {
      font-size: 8vw;
    }
  }
</style>
