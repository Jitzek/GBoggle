<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte";
    import GameInput from "@components/game/GameInput.svelte"
    import Dice from "@components/game/Dice.svelte";
    import TopBar from "@components/game/TopBar.svelte";
    import FoundList from "@components/game/FoundList.svelte";
    export let letters: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"]
</script>

    <BasicContainer style="margin: 10px">
        <TopBar time="3:00" score=1690/>
    </BasicContainer>
    <BasicContainer style="margin: 10px; padding: 10px">
        <div class="game">
            {#each letters as letter}
                <Dice value="{letter}"/>
            {/each}
        </div>
    </BasicContainer>
    <BasicContainer style="margin: 10px">
        <GameInput value="ABCDEFGHIJKLMNOPQu"/>
    </BasicContainer>
    <BasicContainer style="margin: 10px">
        <FoundList/>
    </BasicContainer>

<style>
    .game{
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-gap: 0px;
        justify-content: center;
    }
</style>