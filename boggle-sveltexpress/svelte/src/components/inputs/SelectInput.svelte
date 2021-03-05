<script lang="ts">
  export let disabled: boolean = false;
  export let label: string;
  export let name: string = label || "unset";
  export let style: string;

  let validated: boolean = true;
</script>

<div class="input-field" style="{style}" class:disabled>
  <select
    class:validated
    disabled="{disabled}"
    name="{name}"
    required
    type="text"
  >
    <slot />
  </select>
  {#if label}
    <label for="{name}">{label}</label>
  {/if}
</div>

<style lang="scss">
  $label_height: 24px;

  /**
    Elements
  */
  select {
    background: rgba(255, 255, 255, 0.6);
    border: 0;
    border-bottom: solid white 2px;
    color: rgb(50, 50, 50);
    font-size: 16px;
    outline: 0;
    padding: 10px 10px;
    width: 100%;
    transition: border-color 0.5s;

    // Resetting arrow style
    margin: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;

    // Applying custom arrow style
    background-image: linear-gradient(45deg, transparent 50%, gray 50%),
      linear-gradient(135deg, gray 50%, transparent 50%),
      linear-gradient(to right, #ccc, #ccc);
    background-position: calc(100% - 20px) calc(1em + 2px),
      calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
    background-size: 5px 5px, 5px 5px, 1.5px 1.5em;
    background-repeat: no-repeat;
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

  .disabled select {
    color: rgb(140, 140, 140);
    border-bottom: solid rgba(140, 140, 140, 0.25) 2px;
    cursor: not-allowed;
  }

  .input-field {
    padding-top: $label_height;
    position: relative;
  }

  .input-field select:focus ~ label,
  .input-field select:valid ~ label {
    font-size: 18px;
    top: -30px;
    padding-left: 0px;
  }

  .validated {
    border-bottom: solid rgb(120, 255, 120) 2px;
  }
</style>
