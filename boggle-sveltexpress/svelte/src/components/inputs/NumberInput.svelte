<script lang="ts">
    export let label = null;
    export let max = Infinity;
    export let min = 0;
    export let name = label || "unset";
    export let style = "";

    let validated = false;
  
    let inputElement;
    function handleInput() {
      let inputValue = inputElement.value;
      if (isNaN(parseInt(inputValue)) || isNaN(inputValue - 0)) {
        // Not a Number
        validated = false;
        return;
      }
      if (inputValue < min || inputValue > max) validated = false;
      else validated = true;
    }
  
  </script>
  
  <div class="input-field" style="{style}">
    <input class:validated on:input="{handleInput}" bind:this="{inputElement}" name="{name}" required type="number" />
    {#if label !== null}
      <label for="{name}">{label}</label>
    {/if}
  </div>
  
  <style lang="scss">
    $label_height: 24px;
  
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
  
    .validated {
      border-bottom: solid rgb(120, 255, 120) 2px;
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
  </style>
  