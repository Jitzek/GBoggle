<script lang="ts">
    import {Stopwatch} from "@components/svg/index"
    import Text from "@components/Text.svelte"

    export let time: string;
    export let score: number;
</script>

    <div class="topbar_container">
        <div class="topbar_items_container">
            <div id="stopwatch"><Stopwatch color="white" width="40px"/></div>
            <div id="time"><Text value="{time}"/></div>
        </div>
        <div class="topbar_items_container" id="topbar_right">
            <div id="label"><Text value="score:"/></div>
            <div id="score"><Text value="{score}"/></div>
        </div>
    </div>

<style>

    .topbar_container{
        display: flex;
    }
    .topbar_items_container{
        display: flex;
        width: 50%;
        padding: 10px;
    }
    #topbar_right{
        justify-content: right;
    }
    #stopwatch{
        margin-right: 10px;
    }
    #time{
        font-size: 1.6em;
    }
    #label{
        margin-top: 0.5rem;
    }
    #score{
        margin-left: 10px;
        font-size: 1.6em;
    }

</style>