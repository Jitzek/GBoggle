<script lang="ts">
  // left or right
  export let button_background: string = "#fff";
  export let position: string = "left";
  export let icon_background: string = "#fff";

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
  <button
    class="collapse-button {position}"
    class:collapsed
    on:click="{toggleCollapse}"
    style="left: {left}; right: {right}; background: {button_background}"
  >
    <div class="link-btn-icon-container {position}" style="background: {icon_background};">
        <!-- Icon -->
        <slot name="icon" />
    </div>
  </button>
  <div
    class="component-container {position}"
    class:collapsed
    style="left: {left}; right: {right};"
  >
    <slot name="window" />
  </div>
</div>

<style lang="scss">
  $btn_height: 3.25rem;
  $collapse_animation_duration: 0.5s;
  $btn_icon_width: $btn_height;
  $btn_extend_width: 1.5%;
  $window_size: 350px;

  .collapse-button {
    border: none;
    color: white;
    cursor: pointer;
    height: $btn_height;
    max-width: 100%;
    position: fixed;
    width: calc(#{$btn_icon_width} + #{$window_size} + #{$btn_extend_width});

    transition: all $collapse_animation_duration;
  }

  .collapse-button:active {
      background: initial;
  }

  .collapse-button.left {
    border-radius: 0 28.5px 28.5px 0;
  }

  .collapse-button.right {
    border-radius: 28.5px 0 0 28.5px;

  }

  .collapse-container {
    z-index: 1000;
    float: left;
    position: absolute;
    top: 2rem;
  }

  .collapse-button.collapsed {
    transition: all $collapse_animation_duration;
    max-width: calc(#{$btn_icon_width} + #{$window_size} + #{$btn_extend_width});
  }

  .collapse-button.collapsed.left {
    transform: translateX(-#{$window_size});
  }

  .collapse-button.collapsed.right {
    transform: translateX($window_size);
  }

  .collapse-container {
    position: fixed;
  }

  .component-container.collapsed {
    transition: transform $collapse_animation_duration;
  }

  .component-container.collapsed.left {
    transform: translateX(-$window_size);
  }

  .component-container.collapsed.right {
    transform: translateX($window_size);
  }

  .component-container {
    background: white;
    margin-top: $btn_height;
    width: $window_size;
    height: 100vh;

    position: fixed;

    transition: transform $collapse_animation_duration;
  }

  .link-btn-icon-container {
    margin: auto;
    top: 0;
    bottom: 0;
    width: $btn_icon_width;
    position: absolute;
    overflow: hidden;
    border-radius: 28.5px;
    display: flex;
    justify-content: center;
    transform: rotate(0deg);
  }

  .link-btn-icon-container.right {
    left: 0;
  }

  .link-btn-icon-container.left {
    right: 0;
  }

  @media (max-width: $window_size) {
    .component-container {
      width: 100%;
    }
  }
</style>
