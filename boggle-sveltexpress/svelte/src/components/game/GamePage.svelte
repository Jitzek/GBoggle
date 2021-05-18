<script lang="ts">
  import BasicContainer from "@components/BasicContainer.svelte";
  import GameInput from "@components/game/GameInput.svelte";
  import Dice from "@components/game/Dice.svelte";
  import TopBar from "@components/game/TopBar.svelte";
  import FoundList from "@components/game/FoundList.svelte";
  import { DiceObject } from "./DiceObject";
  import type { Socket } from "socket.io-client";
  import Modal from "@components/Modal.svelte";
  import type { PlayersObject } from "../room/PlayersObject";
  import UserIcon from "@components/UserIcon.svelte";

  export let socket: Socket;
  export let uuid: string;
  export let totalRounds: number;
  export let players: PlayersObject;

  let letters: string[] = [];
  let dice: DiceObject[] = [];
  let selected_dice: DiceObject[] = [];
  let selected_dice_string: string = "";
  let current_round = 1;
  let next_round = 1;
  let players_with_found_words: Map<string, string[]>;
  let players_with_duplicate_words: Map<string, string[]>;
  let duplicated_words_current_player: Map<string, string[]>;

  $: {
    selected_dice;
    selected_dice_string = selected_dice.map((e) => e.value).join("");
  }

  let foundWords: string[] = [];

  const allowed_position_difs = [0, 1, 3, 4, 5];
  function onDicePress(position: number) {
    let _dice = dice.find((e) => e.position === position);
    if (!_dice) {
      return;
    }
    // Check if dice is allowed to be pressed
    if (!allowedDicePress(_dice)) {
      // Dice is not allowed to be (de)selected
      return;
    }
    _dice.toggle();
    if (_dice.selected) {
      // Add to pressed dice
      selected_dice.push(_dice);
    } else {
      // Remove from pressed dice, if it was the last selected one
      selected_dice = selected_dice.filter(
        (e) => e.position !== _dice.position
      );
    }
    dice = dice;
    selected_dice = selected_dice;
  }

  function allowedDicePress(_dice: DiceObject): boolean {
    let last_selected_dice = selected_dice[selected_dice.length - 1];
    if (!last_selected_dice) {
      // This is the first dice to be selected
      return true;
    }
    if (_dice.selected && _dice.position !== last_selected_dice.position) {
      // If dice is selected (deselect request) but it's not the last selected dice, return false
      return false;
    }
    if (selected_dice.length > dice.length) {
      return false;
    }
    if (_dice.position > dice.length) {
      return false;
    }
    const position_dif = Math.abs(_dice.position - last_selected_dice.position);
    if (!allowed_position_difs.includes(position_dif)) {
      return false;
    }
    return true;
  }

  socket.on("round_started", (layout: string[], round: number) => {
    console.log(`Starting round ${round}`);
    reset_dice_selection();
    foundWords = [];
    showNextRoundModal = false;
    current_round = round;
    letters = layout;
    let new_dice: DiceObject[] = [];
    for (let i = 0; i < letters.length; i++) {
      new_dice.push(new DiceObject(letters[i], i, false));
    }
    dice = new_dice;
  });

  let score: number = 0;
  socket.on("player_score_changed", (id: string, _score: number) => {
    if (uuid == id) {
      score = _score;
    }
  });

  let round_time: number = 0;
  socket.on("round_timer_changed", (new_round_time: number) => {
    round_time = new_round_time;
  });

  let next_round_time: number = 0;
  let showNextRoundModal = false;
  socket.on("next_round_timer_changed", (new_next_round_time: number) => {
    next_round_time = new_next_round_time;
    showNextRoundModal = true;
  });

  socket.on("round_ended", (_next_round: number, _players_with_found_words: string, _players_with_duplicate_words: string) => {
    next_round = _next_round;
    if (_players_with_duplicate_words) {
      players_with_duplicate_words = new Map<string, string[]>(JSON.parse(_players_with_duplicate_words));
      duplicated_words_current_player = getDuplicatedWordsWithPlayerIdsForCurrentPlayer();
      console.log(duplicated_words_current_player);
      console.log(duplicated_words_current_player.size);
    }
    if (_players_with_found_words) {
      players_with_found_words = new Map<string, string[]>(JSON.parse(_players_with_found_words));
    }
    console.log("round ended");
    reset_dice_selection();
  });

  function getDuplicatedWordsWithPlayerIdsForCurrentPlayer(): Map<string, string[]> {
        const duplicate_word_with_player_ids = new Map<string, string[]>();

        let all_duplicate_words: string[] = [];
        players_with_duplicate_words.forEach((words: string[], player_id: string) => {
          all_duplicate_words = all_duplicate_words.concat(words.filter((word) => !all_duplicate_words.includes(word)));
        });

        all_duplicate_words.forEach((word) => {
            duplicate_word_with_player_ids.set(word, []);
            players_with_duplicate_words.forEach((words: string[], player_id: string) => {
              if (words.includes(word)) {
                duplicate_word_with_player_ids.get(word)!.push(player_id);
              }
            });
        });

        duplicate_word_with_player_ids.forEach((player_ids: string[], word: string) => {
          // Remove duplicate word if it doesn't include the current player
          if (!player_ids.includes(socket.id)) {
            duplicate_word_with_player_ids.delete(word);
          }
        });

        return duplicate_word_with_player_ids;
    }

  socket.on("game_ended", () => {
    showNextRoundModal = false;
  });

  socket.on(
    "word_validated",
    (word: string, valid: boolean, reason?: string) => {
      if (!valid) {
        console.log(`Word: ${word} was not valid, reason: ${reason}`);
        return;
      }
      console.log(`Word: ${word} was valid, reason: ${reason}`);
      foundWords.push(word);
      foundWords = foundWords;
    }
  );

  function on_submit() {
    if (selected_dice.length < 1) return;
    let selected_dice_positions = selected_dice.map((e) => e.position);
    socket.emit("submit_word", selected_dice_positions);
    reset_dice_selection();
  }

  function reset_dice_selection() {
    dice.forEach((_dice) => (_dice.selected = false));
    dice = dice;
    selected_dice = [];
  }
</script>

<Modal
  id="next-round-modal"
  z_index="99"
  show="{showNextRoundModal}"
  padding_top="10vh"
>
  <div class="next-round-modal-content">
    {#if next_round <= totalRounds}
      {#if next_round_time != 1}
        <h1>Round {next_round} starts in {next_round_time} seconds</h1>
      {:else}
        <h1>Round {next_round} starts in {next_round_time} second</h1>
      {/if}
    {:else}
      <h1>Game ends in {next_round_time} seconds</h1>
    {/if}
    {#if duplicated_words_current_player && duplicated_words_current_player.size > 0}
      <div style="margin-top: 2rem;"></div>
      <h3>Duplicate Words (No points awarded):</h3>
      <div class="duplicate-words-container">
        <table class="duplicate-words-table">
          {#each [...duplicated_words_current_player] as [word, player_ids]}
            <tr>
              <td><strike>{word}</strike></td>
              {#each player_ids as player_id}
                {#if player_id !== socket.id}
                  <td
                    ><UserIcon
                      src="{players.getPlayerById(player_id)?.avatar}"
                      background="#fff"
                    /></td
                  >
                {/if}
              {/each}
            </tr>
          {/each}
        </table>
      </div>
    {/if}
  </div>
</Modal>
<BasicContainer style="margin: 10px">
  <TopBar time="{round_time}" score="{score}" />
</BasicContainer>
<BasicContainer style="margin: 10px; padding: 10px">
  <div class="game">
    {#each dice as _dice}
      <Dice
        on:click="{() => onDicePress(_dice['position'])}"
        value="{_dice['value']}"
        selected="{_dice['selected']}"
      />
    {/each}
  </div>
</BasicContainer>
<BasicContainer style="margin: 10px">
  <GameInput on:click="{on_submit}" value="{selected_dice_string}" />
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
</style>
