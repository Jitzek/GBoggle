<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte"
    import Lock from "@components/svg/lock.svelte"
    import FlagNL from "@components/svg/flagNL.svelte"
    import Users from "@components/svg/user.svelte"
    import Text from "@components/Text.svelte"

    export let islocked: Boolean = false;
    export let name: string;
    export let lang: string;
    export let total_players: number;
    export let max_players: number;

</script>

<BasicContainer style="border-radius: 0.6rem;">
    <table class="rooms">
        <tr>
            <td class="password_protected">
                {#if islocked}
                    <Lock width="30px"/>
                {/if}
            </td>
            <td class="Room_name">
                <Text value="{name}"/>
            </td>
            <td class="language">
                {#if lang == "Dutch"}
                    <FlagNL width="30px"/>
                {:else if lang == "Frisian"}
                    <!-- insert Frisian flag -->
                {:else if lang == "English"}
                    <!-- insert English flag -->
                {:else if lang == "German"}
                    <!-- insert German flag -->
                {:else if lang == "French"}
                    <!-- insert French flag -->
                {/if}
            </td>
            <td class="total_players">
                <Text value="{total_players}/{max_players}"/>
            </td>
            <td class="players_icon">
                <Users width="30px" color="white"/>
            </td>
        </tr>
    </table>
</BasicContainer>

<style>
    .rooms{
        width: 100%;
        table-layout: fixed;
        margin: 10px;
        padding: 5px;
    }
    .password_protected{
        width: 10%;
    }
    .Room_name{
        width: 30%;
        white-space: nowrap;
        overflow: hidden;
    }
    .language{
        width: 10%;
    }
    .total_players{
        width: 10%;
        text-align: right;
    }
    .players_icon{
        width: 10%;
    }
</style>