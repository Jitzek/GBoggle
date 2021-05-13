<script lang="ts">
  import BasicContainer from "@components/BasicContainer.svelte";
  import GameInput from "@components/game/GameInput.svelte";
  import Dice from "@components/game/Dice.svelte";
  import TopBar from "@components/game/TopBar.svelte";
  import FoundList from "@components/game/FoundList.svelte";
  import { DiceObject } from "./DiceObject";
  import type { Socket } from "socket.io-client";

  export let socket: Socket;

  let letters: string[] = [];
  export let uuid: string;

  let dice: DiceObject[] = [];
  let selected_dice: DiceObject[] = [];
  let selected_dice_string: string = "";
  $: {
    selected_dice;
    let _selected_dice_string = "";
    selected_dice.forEach((e) => (_selected_dice_string += e.value));
    selected_dice_string = _selected_dice_string;
  }

  let foundWords: string[] = [];

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
    return true;
  }

  socket.on("round_started", (round: number, layout: string[]) => {
    console.log(`Starting round ${round}`);
    letters = layout;
    let new_dice: DiceObject[] = []
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

  let time: number = 0;
  socket.on("round_timer_changed", (round_time: number) => {
    time = round_time;
  });

  socket.on("round_ended", () => {
    console.log("round ended");
  });

  function on_submit() {
    if (selected_dice.length < 1) return;
    let selected_dice_positions = selected_dice.map((e) => e.position);
    socket.emit("submit_word", selected_dice_positions);
  }
</script>

<BasicContainer style="margin: 10px">
  <TopBar time="{time}" score="{score}" />
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

<style>
  .game {
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-gap: 0px;
    justify-content: center;
  }
</style>
