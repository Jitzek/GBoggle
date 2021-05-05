<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte"
    import BitText from "@components/BitText.svelte"
    import Text from "@components/Text.svelte";
    import {Medal_First, Medal_Second, Medal_Third, Trash} from "@components/svg/index";

    export let placement: number;
    export let avatarpath: string;
    export let name: string;
    export let score: number;
</script>

<BasicContainer style="border-top: 1px solid rgba(255, 255, 255, 0.400); border-bottom: 1px solid rgba(255, 255, 255, 0.400);">
    <table class="leaderboard">
        <tr>
            <td class="placement">
                <Text value={placement} fontSize="1.5em"></Text>
            </td>
            <td class="avatar">
                <div class="container">
                    <img class="leaderboard_avatar" src={avatarpath} alt="">
                    <div class="iconcontainer">
                        {#if placement == 1}
                            <Medal_First width="20px"/>
                        {:else if placement == 2}
                            <Medal_Second width="20px"/>
                        {:else if placement == 3}
                            <Medal_Third width="20px"/>
                        {:else if placement == 4}
                            <Trash width="20px"/>
                        {/if}
                        
                    </div>
                    
                </div>
            </td>
            <td class="name" id="name">
                <Text value={name} fontSize="1.5em"></Text>
            </td>
            <td class="score">
                <BitText fontSize="1.5em" value={score}></BitText>
            </td>
        </tr>
    </table>
</BasicContainer>

<style>
    .leaderboard{
        width: 100%;
        margin: 10px;
        table-layout: fixed;
    }
    .placement{
        width: 5%;
    }
    .avatar{
        width: 5%
    }
    .name{
        width: 50%;
        overflow: hidden;
        max-width: 10%;
        text-align: left;
    }
    .score{
        text-align: right;
        padding-right: 100px;
        width: 40%;
    }
    @media only screen and (max-width: 1500px){
        .placement{
            width: 15%;
        }
        .avatar{
            width: 10%
        }
        .name{
            min-width: 30%;
        }
    }
    @media only screen and (max-width: 700px){
        .score{
            padding-right: 50px;
            min-width: none;
        }
        .name{
            min-width: 20%;
            padding-left: 30px;
        }
    }
    @media only screen and (max-width: 400px){
        .score{
            padding-right: 20px;
        }
        .name{
            min-width: 20%;
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

    .iconcontainer{
        grid-area: inners;
        z-index: 2;
        transform: translate(20px, 20px);
    }
</style>