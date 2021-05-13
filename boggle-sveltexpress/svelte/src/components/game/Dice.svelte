<script lang=ts>
    export let value: string;
    export let selected = false;
</script>

    <div class="dice" on:click class:selected>
        <div class="round">
            <p class="letter">{value}</p>
        </div>
    </div>



<style>
    .dice.selected {
        background-color: #f9af72;
    }
    .dice{
        transition: background-color 0.15s;
        border-radius: 10%;
        background-color: #e7e8e9;
        display: flex;
        justify-content: center;
        align-content: center;
        margin: 5px;
        width: 100px;
        height: 100px;
        padding: 7px;
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
        cursor: pointer;
        
    }
    .round{
        border-radius: 50%;
        width: 100px;
        height: 100px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .dice:hover .round{
        background-color: #ffc89a;
    }
    .letter{
        font-size: 3em;
    }
    @media only screen and (max-width: 600px){
        .dice{
            width: 75px;
            height: 75px;
            margin: 5px;
        }
        .round{
            width: 75px;
            height: 75px;
        }
        .letter{
            font-size: 2.5em;
        }
    }
    @media only screen and (max-width: 470px){
        .dice{
            width: 50px;
            height: 50px;
        }
        .round{
            width: 50px;
            height: 50px;
        }
        .letter{
            font-size: 2em;
        }
    }
    @media only screen and (max-width: 370px){
        .dice{
            width: 45px;
            height: 45px;
            padding: 3px;
        }
        .round{
            width: 45px;
            height: 45px;
        }
        .letter{
            font-size: 1.6em;
        }
    }

</style>