<script lang="ts">
    import Text from "@components/Text.svelte";

    export let foundWords: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
</script>

<div>
    <Text value="Gevonden woorden" fontSize="1.7em"/>
    <div class="flex_container">
        <div class="list">
            <ul>
                {#each foundWords as word, i}
                    {#if i % 2 == 0}
                        <Text value="{word}"/>
                    {/if}
                {/each}
            </ul>
        </div>
        <div>
            <ul>
                {#each foundWords as word, i}
                    {#if i % 2 != 0}
                        <Text value="{word}"/>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
    ul{
        list-style-type: none;
        padding: 0;
    }
    .flex_container{
        display: flex;
        color: white;
        max-height: 40vh;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .flex_container div{
        width: 50%;
    }
    .list{
        border-right: 3px solid white;
    }
    ul{
        font-size: 1.4rem;
        }
    @media only screen and (max-width: 450px){
        ul{
        font-size: 0.8rem;
        }
    }
</style>