<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte";
    import GameInput from "@components/game/GameInput.svelte"
    import Dice from "@components/game/Dice.svelte";
    import TopBar from "@components/game/TopBar.svelte";
    import FoundList from "@components/game/FoundList.svelte";
</script>

    <BasicContainer style="margin: 10px">
        <TopBar time="3:00" score=1690/>
    </BasicContainer>
    <BasicContainer style="margin: 10px; padding: 10px">
        <div class="game">
            <Dice value="A"/>
            <Dice value="B"/>
            <Dice value="C"/>
            <Dice value="D"/>
            <Dice value="E"/>
            <Dice value="F"/>
            <Dice value="G"/>
            <Dice value="H"/>
            <Dice value="I"/>
            <Dice value="J"/>
            <Dice value="K"/>
            <Dice value="L"/>
            <Dice value="M"/>
            <Dice value="N"/>
            <Dice value="O"/>
            <Dice value="P"/>
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