<script lang="ts">
  export let buttonBackground: string = "#fff";
  // left or right
  export let position: string = "left";
  export let iconBackground: string = "#fff";

  export let collapsed: boolean;

  function toggleCollapse() {
    collapsed = !collapsed;
  }
</script>

<div class="collapse-container">
  <button
    class="collapse-button {position}"
    class:collapsed
    on:click="{toggleCollapse}"
    style="background: {buttonBackground}"
  >
    <div
      class="link-btn-icon-container {position}"
      style="background: {iconBackground};"
    >
      <!-- Icon -->
      <slot name="icon" />
    </div>
  </button>
  <div class="component-container {position}" class:collapsed>
    <slot name="window" />
  </div>
  <!-- 
    A component (with slots) will throw a warning if a default slot is not provided.
    This is a bug in the compiler which can be negated by the following line 
    (having no whitespace between named slots will also remove the warning)
    see https://github.com/sveltejs/svelte/issues/4546
   -->
  {#if false}<slot />{/if}
</div>

<style lang="scss">
  $btn_height: 3.25rem;
  $collapse_animation_duration: 0.5s;
  $btn_icon_width: $btn_height;
  $btn_extend_width: 1.5%;
  $window_size: 350px;

  .collapse-container {
    z-index: 1000;
    top: 2rem;
    position: fixed;
    bottom: 0;

    .collapse-button {
      border: none;
      color: white;
      cursor: pointer;
      height: $btn_height;
      max-width: 100%;
      position: fixed;
      width: calc(#{$btn_icon_width} + #{$window_size} + #{$btn_extend_width});

      transition: all $collapse_animation_duration;

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
    }

    .collapse-button:active {
      background: initial;
    }

    .collapse-button.left {
      border-radius: 0 28.5px 28.5px 0;
      left: 0;
      right: auto;
    }

    .collapse-button.right {
      border-radius: 28.5px 0 0 28.5px;
      left: auto;
      right: 0;
    }

    .collapse-button.collapsed {
      transition: all $collapse_animation_duration;
      max-width: calc(
        #{$btn_icon_width} + #{$window_size} + #{$btn_extend_width}
      );
    }

    .collapse-button.collapsed.left {
      transform: translateX(-#{$window_size});
    }

    .collapse-button.collapsed.right {
      transform: translateX($window_size);
    }

    .component-container.left {
      left: 0;
      right: auto;
    }

    .component-container.right {
      left: auto;
      right: 0;
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
      height: 100%;

      position: fixed;

      overflow-y: auto;

      transition: transform $collapse_animation_duration;
    }

    @media (max-width: $window_size) {
      .component-container {
        width: 100%;
      }
    }
  }
</style>
