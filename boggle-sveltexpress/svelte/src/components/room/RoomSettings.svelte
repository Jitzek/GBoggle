<script lang="ts">
  import BasicContainer from "@components/BasicContainer.svelte";
  import Text from "@components/Text.svelte";
  import { SelectInput } from "@components/inputs";
  import LinkButton from "@components/LinkButton.svelte";
  import { Shuttle } from "@components/svg/index.js";
  import type { Socket } from "socket.io-client";

  export let roomId: string;
  export let isHost = false;
  export let socket: Socket;

  let rounds_value: number;
  let round_time_value: number;
  let language_value: string;

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

  socket.on(
    "settings_changed",
    (rounds: number, round_time: number, language: string) => {
      rounds_value = rounds;
      round_time_value = round_time;
      language_value = language;
    }
  );

  const rounds_setting_changed = () => socket.emit("rounds_setting_changed", rounds_value);
  const round_time_setting_changed = () => socket.emit("round_time_setting_changed", round_time_value);
  const language_setting_changed = () => socket.emit("language_setting_changed", language_value);
</script>

<div>
  <BasicContainer>
    <Text fontSize="2.5rem" value="Room Settings" />
    <form>
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
        disabled="{!isHost}"
      >
        {#each ["Dutch"] as language}
          <option value="{language}">{language}</option>
          <option value="English">English</option>
        {/each}
      </SelectInput>
      <div style="margin-top: 6rem;"></div>
      <LinkButton
        btn_background="#13a8e0"
        btn_width="100%"
        text_color="white"
        value="Start Game"
        disabled="{!isHost}"
      >
        <Shuttle color="#13a8e0" width="60%" />
      </LinkButton>
      <div style="padding-bottom: 4rem;"></div>
    </form>
  </BasicContainer>

  <div style="margin-top: 2rem"></div>

  <!-- TODO: Move to Room so it can also be accessed ingame (make this a component aswell) -->
  <Text fontSize="2.5rem" value="Invite Others!" />
  <div class="invite-container" on:click="{() => copyElement(inviteLink)}">
    <div class="invite-link-container">
      <span bind:this="{inviteLink}" class="invite-link"
        >{`http://${window.location.host}/?invite-link=${roomId}`}</span
      >
    </div>
    <div class="copy-btn-container">
      <div class="copy-btn">
        <Text value="Copy" />
      </div>
    </div>
  </div>
  <div style="padding-bottom: 4rem;"></div>
</div>

<style lang="scss">
  form {
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
    display: table;
    cursor: pointer;
  }

  .invite-link-container {
    background: white;
    color: rgb(255, 136, 0);
    width: 100%;
    display: table-cell;
    white-space: nowrap;
    max-width: 0px;
  }

  .invite-link {
    color: black;
  }
</style>
