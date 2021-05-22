<script lang="ts">
  import BasicContainer from "@components/BasicContainer.svelte";
  import GameInput from "@components/game/GameInput.svelte";
  import Dice from "@components/game/Dice.svelte";
  import TopBar from "@components/game/TopBar.svelte";
  import FoundList from "@components/game/FoundList.svelte";
  import Modal from "@components/Modal.svelte";
  import UserIcon from "@components/UserIcon.svelte";
  import BitText from "@components/BitText.svelte";
  import type { Player } from "../room/objects/Player";
  import type { Board } from "../room/objects/game/Board";
  import type { Dice as DiceObject } from "../room/objects/game/Dice";
  import type { Room as RoomObject } from "../room/objects/Room";
  import type { Game as GameObject } from "../room/objects/game/Game";

  export let room: RoomObject;

  let selectedDiceString: string = "";
  let scoreOfCurrentPlayer: number = 0;
  let foundWords: string[] = [];
  let roundTimer: number;
  let nextRoundTimer: number;
  let nextRound: number;
  let duplicateWordsOfCurrentPlayerWithOtherPlayers: Map<string, Player[]>;
  let scoreGainedOfCurrentPlayer: number;

  let game: GameObject = room.game.get();
  let board: Board;
  let layout: DiceObject[];

  room.game.subscribe((value) => {
    game = value;
    if (game) {
      game.board.subscribe((value) => {
        board = value;
        if (board) {
          layout = board.layout.get();
          selectedDiceString = board.getSelectedDiceAsString();
        }
      });
      game.playerScore.subscribe((value) => {
        scoreOfCurrentPlayer = value;
      });
      game.foundWords.subscribe((value) => {
        foundWords = value;
      });
      game.roundTimer.subscribe((value) => {
        roundTimer = value;
      });
      game.nextRoundTimer.subscribe((value) => {
        nextRoundTimer = value;
      });
      game.nextRound.subscribe((value) => {
        nextRound = value;
      });
      game.duplicateWordsOfCurrentPlayerWithOtherPlayers.subscribe((value) => {
        duplicateWordsOfCurrentPlayerWithOtherPlayers = value;
      });
      game.scoreGainedOfCurrentPlayer.subscribe((value) => {
        scoreGainedOfCurrentPlayer = value;
      });
      game.start();
    } else {
      foundWords = [];
      scoreOfCurrentPlayer = 0;
      scoreGainedOfCurrentPlayer = 0;
      nextRound = 1;
      roundTimer = 0;
      layout = [];
    }
  });
</script>

{#if game}
  <Modal
    id="next-round-modal"
    z_index="99"
    show="{game && roundTimer <= 0 && nextRoundTimer > 0}"
    padding_top="10vh"
  >
    <div class="next-round-modal-content">
      {#if nextRound <= game.totalRounds}
        {#if nextRound != 1}
          <h1>Round {nextRound} starts in {nextRoundTimer} seconds</h1>
        {:else}
          <h1>Round {nextRound} starts in {nextRoundTimer} second</h1>
        {/if}
      {:else}
        <h1>Game ends in {nextRoundTimer} seconds</h1>
      {/if}
      {#if duplicateWordsOfCurrentPlayerWithOtherPlayers && duplicateWordsOfCurrentPlayerWithOtherPlayers.size > 0}
        <div style="margin-top: 2rem;"></div>
        <h3>Duplicate Words (No points awarded):</h3>
        <div class="duplicate-words-container">
          <table class="duplicate-words-table">
            {#each [...duplicateWordsOfCurrentPlayerWithOtherPlayers] as [word, players]}
              <tr>
                <td><strike>{word}</strike></td>
                {#each players as player}
                  {#if player && player.uuid !== game.playerId}
                    <td><UserIcon src="{player.avatar}" background="#fff" /></td
                    >
                  {/if}
                {/each}
              </tr>
            {/each}
          </table>
        </div>
        <div style="margin-bottom: 2rem;"></div>
      {/if}
      {#if scoreGainedOfCurrentPlayer}
        <div class="score-gained-container">
          <BitText
            color="#fff"
            fontSize="2rem"
            value="+{scoreGainedOfCurrentPlayer}"
          />
        </div>
      {/if}
    </div>
  </Modal>
{/if}
<BasicContainer style="margin: 10px">
  <TopBar time="{roundTimer}" score="{scoreOfCurrentPlayer}" />
</BasicContainer>
<BasicContainer style="margin: 10px; padding: 10px">
  <div class="game">
    {#if layout}
      {#each layout as dice}
        <Dice
          on:click="{() =>
            game?.board?.update((board) => board?.selectDice(dice.position))}"
          value="{dice.value}"
          selected="{dice.selected}"
        />
      {/each}
    {/if}
  </div>
</BasicContainer>
<BasicContainer style="margin: 10px">
  <GameInput
    on:click="{() => game.submitWord()}"
    value="{selectedDiceString}"
  />
</BasicContainer>
<BasicContainer style="margin: 10px">
  <FoundList foundWords="{foundWords}" />
</BasicContainer>

<style lang="scss">
  .game {
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-gap: 0px;
    justify-content: center;
  }

  .next-round-modal-content {
    margin: auto;
    width: 50%;
    height: 100%;

    h1 {
      color: #fff;
    }

    h3 {
      text-align: left;
      color: #fff;
    }
  }

  @media screen and (max-width: 500px) {
    .next-round-modal-content {
      width: 90%;
    }
  }

  .duplicate-words-container {
    max-height: 60vh;
    overflow: auto;
    .duplicate-words-table {
      color: #fff;
      text-align: left;

      tr > td {
        padding-bottom: 1rem;
      }

      td {
        padding-right: 0.5rem;
      }
    }
  }

  .score-gained-container {
    text-align: left;
  }
</style>
