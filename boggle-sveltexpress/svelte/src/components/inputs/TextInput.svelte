<script lang="ts">
  import { onMount } from "svelte";

  export let disabled: boolean = false;
  export let label: string = "";
  export let maxLength: number = Infinity;
  export let minLength: number = 0;
  export let name: string = label || "unset";
  export let style: string = "";

  // TODO: If type === password, allow user to see password as plain text
  export let type: string = "text";

  export let value = "";

  let validated: boolean = false;

  let inputElement: HTMLInputElement;
  function verifyInput(input: string) {
    let trimmedInputValue = input.trim();
    // If the trimmed input (no leading or trailing whitespace) is not within the allowed range
    if (
      trimmedInputValue.length < minLength ||
      trimmedInputValue.length > maxLength
    ) {
      // Input is invalid
      validated = false;
    } else {
      // Else input is valid
      validated = true;
    }
  }

  $: {
    value;
    verifyInput(value);
  }

  onMount(() => {
    inputElement.type = type;
  });
</script>

<div class="input-field" class:disabled style="{style}">
  <input
    id="{name}"
    class:validated
    disabled="{disabled}"
    on:input="{() => verifyInput(String(inputElement.value))}"
    bind:this="{inputElement}"
    bind:value="{value}"
    on:keypress
    on:blur
    name="{name}"
    required
    type="text"
  />
  {#if label}
    <label for="{name}">{label}</label>
  {/if}
</div>

<style lang="scss">
  $label_height: 24px;

  /**
    Elements
  */
  input {
    background: rgba(255, 255, 255, 0.6);
    border: 0;
    border-bottom: solid white 2px;
    color: rgb(50, 50, 50);
    font-size: 16px;
    outline: 0;
    padding: 10px 10px;
    width: 100%;
    transition: border-color 0.5s;
  }
  
  input:focus{
    background-color: rgba(255, 255, 255, 0.75);
  }

  label {
    color: white;
    font-size: 20px;
    padding: calc(#{$label_height} + 6px) 10px 0;
    pointer-events: none;
    position: absolute;
    text-shadow: 1.2px 1.2px 1px rgba(0, 0, 0, 0.5);
    top: 0;
    transition: 0.25s;
  }

  /**
    Classes
  */
  .disabled label {
    font-size: 18px;
    top: -30px;
    padding-left: 0px;
  }

  .disabled input {
    color: rgb(140, 140, 140);
    border-bottom: solid rgba(140, 140, 140, 0.25) 2px;
    cursor: not-allowed;
  }

  .input-field {
    padding-top: $label_height;
    position: relative;
  }

  .input-field input:focus ~ label,
  .input-field input:valid ~ label {
    font-size: 18px;
    top: -30px;
    padding-left: 0px;
  }

  .validated {
    border-bottom: solid rgb(120, 255, 120) 2px;
  }
</style>
