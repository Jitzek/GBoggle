<script lang="typescript">
    import * as _ from "lodash";
    import BitText from "@components/BitText.svelte"
    import LeaderboardRow from "@components/LeaderboardRow.svelte";
    import type { PlayerScores } from "../types/Types";

    let playerScores: PlayerScores[] = [
        {name: "Gurbe", score: 100},
        {name: "swrtgb", score: 200},
        {name: "wrsgndefcv", score: 300},
        {name: "Guqqwerfbdsrbe", score: 200},
        {name: "Guwadfbrbe", score: 100},
        {name: "Guebfrbddxrbe", score: 600},
        {name: "Guwrberbe", score: 300},
        {name: "Guqwberfbrbe", score: 500},
        {name: "Gsdxawaedfrburbe", score: 200},
        {name: "Gubterwqdrbe", score: 700},
        {name: "Guqerwdgerbe", score: 600},
    ]

    playerScores= _.orderBy(playerScores, "score", "desc");

</script>

<div>
    <div class="leaderboardtitlecontainer">
        <BitText ref="leaderboardtitle" fontSize="none" value="Leaderboard"></BitText>
    </div>
    <div class="leaderbordrows">
        {#each playerScores as playerScore, i}
            <LeaderboardRow placement={i + 1} name="{playerScore.name}" score={playerScore.score}/>
        {/each}
    </div>
</div>

<style>
    .leaderboardtitlecontainer{
        padding: 20px 0 20px 0; 
        margin-top: 20px;
    }
    .leaderbordrows{
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 50vh;
    }
    :global([ref=leaderboardtitle]){
        font-size: 4vw;
    }
    @media only screen and (max-width: 1200px){
        :global([ref=leaderboardtitle]){
        font-size: 5vw;
        }
    }
    @media only screen and (max-width: 700px){
        :global([ref=leaderboardtitle]){
        font-size: 7vw;
        }
    }
    @media only screen and (max-width: 400px){
        :global([ref=leaderboardtitle]){
        font-size: 7vw;
        }
    }
    @media only screen and (max-width: 350px){
        :global([ref=leaderboardtitle]){
        font-size: 8vw;
        }
    }
</style>