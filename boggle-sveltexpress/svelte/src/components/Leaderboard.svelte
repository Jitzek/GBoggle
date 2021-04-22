<script lang="typescript">
    import BitText from "@components/BitText.svelte"
    import LeaderboardRow from "@components/LeaderboardRow.svelte";

</script>

<div>
    <div class="leaderboardtitlecontainer">
        <BitText ref="leaderboardtitle" value="Leaderboard"></BitText>
    </div>
    <div class="leaderbordrows">
        <LeaderboardRow placement="1" name="gurberfdgbpoiubrgoiuhebvf" score="100"></LeaderboardRow>
        <LeaderboardRow placement="1" name="gurbe" score="100"></LeaderboardRow>
        <LeaderboardRow placement="1" name="gurbe" score="100"></LeaderboardRow>
        <LeaderboardRow placement="1" name="gurbe" score="100"></LeaderboardRow>
        <LeaderboardRow placement="1" name="gurbe" score="100"></LeaderboardRow>
        <LeaderboardRow placement="1" name="gurbe" score="100"></LeaderboardRow>
        <LeaderboardRow placement="1" name="gurbe" score="100"></LeaderboardRow>
        <LeaderboardRow placement="1" name="gurbe" score="100"></LeaderboardRow>
    </div>
</div>

<style>
    .leaderboardtitlecontainer{
        padding: 20px 0 20px 0; 
        margin-top: 20px
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