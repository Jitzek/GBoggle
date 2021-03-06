<script lang="ts">
  export let disabled: boolean = false;
  export let label: string;
  export let max: number = Infinity;
  export let min: number = 0;
  export let name: string = label || "unset";
  export let style: string;

  export let value: number;

  let validated: boolean = false;

  let inputElement: HTMLInputElement;

  let prevValidValue = min;
  function verifyInput() {
    // If input is not a number or is out of the allowed range
    if (
      !isNumber(inputElement.value) ||
      Number(inputElement.value) < min ||
      Number(inputElement.value) > max
    ) {
      // Default to previous valid value
      inputElement.value = prevValidValue.toString();
    }
    // Given input is allowed or defaulted to previous valid value
    // Either way the input is valid
    validated = true;
    prevValidValue = Number(inputElement.value);
  }

  function increment() {
    inputElement.stepUp();
    verifyInput();
  }

  function decrement() {
    inputElement.stepDown();
    verifyInput();
  }

  function isNumber(input): boolean {
    return !(isNaN(parseInt(input)) || isNaN(input - 0));
  }
</script>

<div class="input-field" class:disabled style="{style}">
  <button on:click="{decrement}" class="input-decrement" disabled="{disabled}">
    <i>-</i>
  </button>
  <input
    bind:this="{inputElement}"
    bind:value="{value}"
    class:validated
    disabled="{disabled}"
    name="{name}"
    on:input="{verifyInput}"
    required
    step="1"
    type="number"
  />
  <button on:click="{increment}" class="input-increment" disabled="{disabled}">
    <i>+</i>
  </button>
  {#if label}
    <label for="{name}">{label}</label>
  {/if}
</div>

<style lang="scss">
  $label_height: 24px;

  /**
    Elements
  */
  button {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.25);
    border: none;
    width: 3rem;
    height: 2.55rem;
    color: rgba(0, 0, 0, 0.45);
    font-weight: 800;
  }

  button:hover {
    color: rgba(0, 0, 0, 0.65);
    transition: color 0.25s;
  }

  button:active {
    color: rgb(0, 0, 0);
    background-color: rgba(255, 255, 255, 0.5);
    transition: 0.1s;
  }

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
    text-align: center;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  input[type="number"]:hover::-webkit-inner-spin-button,
  input[type="number"]:hover::-webkit-outer-spin-button {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }

  label {
    color: white;
    font-size: 20px;
    padding: calc(#{$label_height} + 6px) 50% 0;
    pointer-events: none;
    position: absolute;
    text-shadow: 1.2px 1.2px 1px rgba(0, 0, 0, 0.5);
    top: 0;
    transition: 0.5s;
    margin-left: calc(-#{$label_height} - 6px);
  }

  /**
    Classes
  */
  .disabled input {
    color: rgb(140, 140, 140);
    border-bottom: solid rgba(140, 140, 140, 0.25) 2px;
    cursor: not-allowed;
  }

  .disabled button {
    color: rgb(140, 140, 140);
    cursor: not-allowed;
  }

  .disabled button:active {
    background-color: rgba(255, 255, 255, 0.25);
    transition: 0.1s;
  }

  .disabled label {
    font-size: 18px;
    top: -30px;
    margin-left: 0;
    padding-left: 0px;
  }

  .input-decrement {
    left: 0;
  }

  .input-field {
    padding-top: $label_height;
    position: relative;
  }

  .input-increment {
    right: 0;
  }

  .input-field input:focus ~ label,
  .input-field input:valid ~ label {
    font-size: 18px;
    top: -30px;
    margin-left: 0;
    padding-left: 0px;
  }

  .validated {
    border-bottom: solid rgb(120, 255, 120) 2px;
  }
</style>
