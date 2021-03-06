<script lang="ts">
  import BasicContainer from "@components/BasicContainer.svelte";
  import Text from "@components/Text.svelte";
  import { SelectInput } from "@components/inputs";
  import LinkButton from "@components/LinkButton.svelte";
  import { Shuttle } from "@components/svg/index.js";
  import CheckboxInput from "../inputs/CheckboxInput.svelte";
  import { GameType, Room } from "./objects/Room";

  export let room: Room;

  let rounds_value: number = room.roomSettings.rounds.get();
  let round_time_value: number = room.roomSettings.roundTime.get();
  let language_value: string = room.roomSettings.language.get();
  let unique_words_only_value: boolean = room.roomSettings.uniqueWordsOnly.get();

  room.roomSettings.rounds.subscribe((value) => {
    rounds_value = value;
  });
  room.roomSettings.roundTime.subscribe((value) => {
    round_time_value = value;
  });
  room.roomSettings.language.subscribe((value) => {
    language_value = value;
  });
  room.roomSettings.uniqueWordsOnly.subscribe((value) => {
    unique_words_only_value = value;
  });

  let isHost = room.hostId === room.client.id;
  let singleplayer = room.gametype === GameType.SINGLEPLAYER;

  let inviteLink: HTMLElement;

  /**
   *
   * @param e Element to be copied
   */
  function copyElement(e: HTMLElement) {
    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
    }

    let range = document.createRange();
    range.selectNode(e);
    selection.addRange(range);
    document.execCommand("copy");
  }

  const rounds_setting_changed = () =>
    room.roomSettings.changeRounds(rounds_value);
  const round_time_setting_changed = () =>
    room.roomSettings.changeRoundTime(round_time_value);
  const language_setting_changed = () =>
    room.roomSettings.changeLanguage(language_value);
  const unique_words_only_setting_changed = () =>
    room.roomSettings.changeUniqueWordsOnly(unique_words_only_value);

  function start_game() {
    if (!isHost && !singleplayer) return;
    room.startGame();
  }
</script>

<div>
  <BasicContainer>
    <Text fontSize="2.5rem" value="Room Settings" />
    <div class="room-settings-container">
      <SelectInput
        bind:value="{rounds_value}"
        on:change="{rounds_setting_changed}"
        label="Rounds"
        name="rounds"
        disabled="{!isHost}"
      >
        {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as round}
          <option value="{round}">{round}</option>
        {/each}
      </SelectInput>
      <div style="margin-top: 2rem;"></div>
      <SelectInput
        bind:value="{round_time_value}"
        on:change="{round_time_setting_changed}"
        label="Round time in seconds"
        name="time"
        disabled="{!isHost}"
      >
        {#each [30, 60, 90, 120, 150, 180, 210, 240, 270, 300] as time}
          <option value="{time}">{time}</option>
        {/each}
      </SelectInput>
      <div style="margin-top: 2rem;"></div>
      <SelectInput
        bind:value="{language_value}"
        on:change="{language_setting_changed}"
        label="Language"
        name="language"
        disabled="{!isHost && !singleplayer}"
      >
        {#each ["Dutch"] as language}
          <option value="{language}">{language}</option>
          <option value="English">English</option>
        {/each}
      </SelectInput>
      <div style="margin-top: 2rem;"></div>
      <div style="text-align: left;">
        <CheckboxInput value="Unique words only" bind:checked={unique_words_only_value} on:message={unique_words_only_setting_changed} disabled="{!isHost}" />
      </div>
      <div style="margin-top: 6rem;"></div>
      <LinkButton
        btn_background="#13a8e0"
        btn_width="100%"
        text_color="white"
        value="Start Game"
        disabled="{!isHost && !singleplayer}"
        on:click="{start_game}"
      >
        <Shuttle color="#13a8e0" width="60%" />
      </LinkButton>
      <div style="padding-bottom: 4rem;"></div>
    </div>
  </BasicContainer>

  <div style="margin-top: 2rem"></div>

  {#if !singleplayer}
    <!-- TODO: Move to Room so it can also be accessed ingame (make this a component aswell) -->
    <Text fontSize="2.5rem" value="Invite Others!" />
    <table class="invite-container" on:click="{() => copyElement(inviteLink)}">
      <td class="invite-link-container">
        <span bind:this="{inviteLink}" class="invite-link"
          >{`http://${window.location.host}/?invite-link=${room.uuid}`}</span
        >
      </td>
      <td class="copy-btn-container">
        <div class="copy-btn">
          <Text value="Copy" />
        </div>
      </td>
    </table>
  {/if}
  <div style="padding-bottom: 4rem;"></div>
</div>

<style lang="scss">
  .room-settings-container {
    max-width: 80%;
    margin: auto;
  }

  .copy-btn {
    background: rgb(255, 136, 0);
    border: none;
    margin: 0 !important;
    padding: 0.5rem;
  }

  .copy-btn:active {
    background: rgb(255, 123, 0);
  }

  .copy-btn-container {
    display: table-cell;
  }

  .invite-container {
    margin: auto;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    width: 100%;
  }

  .invite-link-container {
    background: white;
    color: rgb(255, 136, 0);
    white-space: nowrap;
    width: 100%;
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .invite-link {
    color: black;
  }
</style>
