<script lang="typescript">
    import BasicContainer from "@components/BasicContainer.svelte"
    import BitText from "@components/BitText.svelte"
    import Text from "@components/Text.svelte";
    import {Medal_First} from "@components/svg/index";

</script>

<div>
    <BitText ref="leaderboardtitle" value="Leaderboard"></BitText>
    <div>
        <BasicContainer borders="{true}">
            <table class="leaderboard">
                <tr>
                    <td class="placement">
                        <Text value="1" fontSize="1.5em"></Text>
                    </td>
                    <td class="avatar">
                        <div class="container">
                            <img class="leaderboard_avatar" src="../img/linus.png" alt="">
                            <Medal_First width="20px"></Medal_First>
                        </div>
                    </td>
                    <td class="name">
                        <Text value="Gurbe" fontSize="1.2em">Gurbe</Text>
                    </td>
                    <td class="score">
                        <BitText fontSize="1.5em" value="9999"></BitText>
                    </td>
                </tr>
            </table>
        </BasicContainer>
    </div>
</div>

<style>
    :global([ref=leaderboardtitle]){
        font-size: 4vw;
    }
    .leaderboard{
        width: 100%;
        margin: 10px;
    }
    .placement{
        width: 5%;
    }
    .avatar{
        width: 5%
    }
    .name{
        width: 10%;
    }
    .score{
        text-align: right;
        padding-right: 100px;
    }
    @media only screen and (max-width: 1500px){
        .placement{
        width: 15%;
        }
        .avatar{
            width: 10%
        }
        .name{
            width: 30%;
        }
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
        .score{
            padding-right: 50px;
        }
    }
    @media only screen and (max-width: 400px){
        :global([ref=leaderboardtitle]){
        font-size: 7vw;
        }
        .score{
            padding-right: 20px;
        }
    }
    @media only screen and (max-width: 350px){
        :global([ref=leaderboardtitle]){
        font-size: 8vw;
        }
    }
    .container{
        margin: 0 auto;
        display: grid;
        place-items: center;
        grid-template-areas: "inners";
    }
    .leaderboard_avatar{
        border-radius: 50%;
        width: 40px;
        height: 40px;
        border: 3px solid #3a3838;
        object-fit: cover;
        overflow: hidden;
        grid-area: inners;
        z-index: 1;
    }

    :global(.medal){
        grid-area: inners;
        z-index: 2;
        transform: translate(20px, 20px);
    }
</style>