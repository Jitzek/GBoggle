<script lang="ts">
  export let room_id: string;
  // left or right
  export let position: string = "left";

  let component;
  let collapsed: boolean = true;

  // Default
  let left = "0";
  let right = "auto";
  // Change if position is "right"
  if (position === "right") {
    left = "auto";
    right = "0";
  }

  function toggleCollapse() {
      collapsed = !collapsed;
  }
</script>

<div class="collapse-container">
  <button class="collapse-button" class:collapsed on:click="{toggleCollapse}" style="left: {left}; right: {right};">
  </button>
  <div class="players-container" class:collapsed>
    <h1>Players</h1>
  </div>
</div>

<style lang="scss">
  $button_height: 4rem;
  $collapse_animation_duration: 0.5s;
  $button_icon_width: 50px;
  $window_size: 350px;

  .collapse-button {
    background-color: #555;
    border: none;
    color: white;
    cursor: pointer;
    height: $button_height;
    position: fixed;
    width: $window_size;

    transition: transform $collapse_animation_duration;
  }

  .collapse-container {
      z-index: 1000;
  }

  .collapse-button.collapsed {
    transform: translateX(calc(-#{$window_size} + #{$button_icon_width}));
    transition: transform $collapse_animation_duration;
  }

  .collapse-container {
    position: -webkit-sticky;
    position: fixed;
  }


  .players-container.collapsed {
    transform: translateX(-$window_size);
    transition: transform $collapse_animation_duration;
  }

  .players-container {
    background: white;
    bottom: 0;
    margin-top: $button_height;
    top: 0;
    width: $window_size;
    height: 80vh;

    // display: none;
    right: 15px;

    transition: transform $collapse_animation_duration;
  }
</style>
