<script lang="ts">
  export let label = null;
  export let max = Infinity;
  export let min = 0;
  export let name = label || "unset";
  export let style = "";

  let validated = false;

  let inputElement;
  let prevValidValue = min;
  function verifyInput() {
    if (
      !isNumber(inputElement.value) ||
      inputElement.value < min ||
      inputElement.value > max
    ) {
      // Not a Number
      inputElement.value = prevValidValue;
    }
    validated = true;
    prevValidValue = inputElement.value;
  }

  function increment() {
    if (!isNumber(inputElement.value)) inputElement.value = 0;
    inputElement.value = Number(inputElement.value) + 1;
    verifyInput();
  }

  function decrement() {
    if (!isNumber(inputElement.value)) inputElement.value = 0;
    inputElement.value = Number(inputElement.value) - 1;
    verifyInput();
  }

  function isNumber(input): boolean {
    return !(isNaN(parseInt(input)) || isNaN(input - 0));
  }
</script>

<div class="input-field" style="{style}">
  <button on:click="{decrement}" class="input-decrement">
    <i>-</i>
  </button>
  <input
    class:validated
    on:input="{verifyInput}"
    bind:this="{inputElement}"
    name="{name}"
    required
    type="number"
  />
  <button on:click="{increment}" class="input-increment">
    <i>+</i>
  </button>
  {#if label !== null}
    <label for="{name}">{label}</label>
  {/if}
</div>

<style lang="scss">
  $label_height: 24px;

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
    transition: color 0.25s;
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

  .validated {
    border-bottom: solid rgb(120, 255, 120) 2px;
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
</style>
