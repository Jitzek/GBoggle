<script lang="ts">
    import {Send} from "@components/svg/index";
    import Text from "@components/Text.svelte";

    export let value: string;
</script>

<div class="gameinput">
    <div class="text">
        <Text value="{value}"/>
    </div>
    <div class="button">
        <button class="send_button">
            <Send width="30px"/>
        </button>
    </div>

</div>

<style>
    .gameinput{
        display: grid;
        place-items: center;
        grid-template-areas: "inners";
        padding: 10px;
    }
    .text{
        grid-area: inners;
        width: 100%;
        font-size: 2em;
    }
    .button{
        grid-area: inners;
        width: 100%;
    }
    .send_button{
        border-radius: 50%;
        background-color: white;
        padding: 10px;
        margin: 0 0 0 0;
        float: right;
        margin-right: 10%;
    }

    @media only screen and (max-width: 700px){
        .text{
            font-size: 1.3em;
        }
        .send_button{
            margin-right: 5%
        }
    }
    
    @media only screen and (max-width: 450px){
        .text{
            font-size: 1em;
        }
    }

    @media only screen and (max-width: 400px){
        .text{
            font-size: 0.8em;
        }
        .send_button{
            margin-right: 2%
        }
    }
    @media only screen and (max-width: 350px){
        .gameinput{
            padding-right: 1px;
        }
        .send_button{
            padding: 5px;
        }
    }
</style>