<script lang="ts">
  import BasicContainer from "../components/BasicContainer.svelte";
  import GboggleLogo from "../components/GBoggleLogo.svelte";
  import Text from "../components/Text.svelte";
  import { SelectInput } from "../components/inputs";
  import LinkButton from "../components/LinkButton.svelte";
  import Shuttle from "../components/svg/shuttle.svelte";
  import NumberInput from "../components/inputs/NumberInput.svelte";
  import TextInput from "../components/inputs/TextInput.svelte";

  export let room_id: string;

  let inviteLink: HTMLElement;

  /**
   *
   * @param e Element to be copied
   */
  function copyElement(e: HTMLElement) {
    // Remember display style
    let temp = e.style.display;

    // Make sure display is not 'none'
    e.style.display = "initial";

    let selection = window.getSelection();
    if (selection.rangeCount > 0) {
      selection.removeAllRanges();
    }

    let range = document.createRange();
    range.selectNode(e);
    selection.addRange(range);
    document.execCommand("copy");

    // Reset display style
    e.style.display = temp;
  }
</script>

<div>
  <GboggleLogo size="20rem" />
  <BasicContainer>
    <Text fontSize="2.5rem" value="Room Settings" />
    <form>
      <SelectInput label="Rounds" name="rounds">
        {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as round}
          <option value="{round}">{round}</option>
        {/each}
      </SelectInput>
      <div style="margin-top: 2rem;"></div>
      <SelectInput label="Round time in seconds" name="time">
        {#each [30, 60, 90, 120, 150, 180, 210, 240, 270, 300] as time}
          <option value="{time}">{time}</option>
        {/each}
      </SelectInput>
      <div style="margin-top: 2rem;"></div>
      <SelectInput label="Language" name="language">
        {#each ["Dutch"] as language}
          <option value="{language}">{language}</option>
        {/each}
      </SelectInput>
      <div style="margin-top: 6rem;"></div>
      <LinkButton
        btn_background="#13a8e0"
        btn_width="100%"
        text_color="white"
        value="Start Game"
      >
        <Shuttle color="#13a8e0" width="60%" />
      </LinkButton>
      <div style="padding-bottom: 4rem;"></div>
    </form>
  </BasicContainer>

  <div style="margin-top: 2rem"></div>

  <Text fontSize="2.5rem" value="Invite Others!" />
  <div class="invite-container">
    <div class="invite-link-container">
      <span id="link" class="hover-me"
        >Hover over here to see the invite link!</span
      >
      <span
        bind:this="{inviteLink}"
        on:click="{() => copyElement(inviteLink)}"
        class="invite-link">{`${window.location.host}/room/${room_id}`}</span
      >
    </div>
    <div class="hover-btn-container">
      <button class="hover-btn" on:click="{() => copyElement(inviteLink)}">
        <Text value="Copy" />
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  form {
    max-width: 80%;
    margin: auto;
  }

  .invite-container {
    margin: auto;
    text-align: center;
    vertical-align: middle;
    display: table;
  }

  .hover-btn {
    background: rgb(255, 136, 0);
    border: none;
    margin: 0 !important;
    padding: 0.5rem;
    cursor: pointer;
  }

  .hover-btn:active {
    background: rgb(255, 123, 0);
  }

  .hover-btn-container {
    display: table-cell;
  }

  .invite-link-container {
    background: white;
    color: rgb(255, 136, 0);
    width: 100%;
    display: table-cell;
  }

  .invite-link-container:hover {
    .invite-link {
      display: initial;
    }

    .hover-me {
      display: none;
    }
  }

  .invite-link {
    display: none;
    color: black;
  }
</style>
