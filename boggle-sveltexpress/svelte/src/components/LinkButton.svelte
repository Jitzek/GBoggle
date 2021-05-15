<script lang="ts">
  export let disabled: boolean = false;
  export let value: string = "Button";
  export let text_color: string = "#ffffff";
  export let btn_background: string = "#aaaaaa";
  export let btn_background_hover: string = btn_background;
  export let icon_background: string = "#ffffff";
  export let btn_width: string;
  export let href: string = undefined;
</script>

<button
  on:click="{() => {
    if (href) {
      location.href = href;
    }
  }}"
  on:click
  class="link-btn"
  class:disabled
  style="color: {text_color}; background: linear-gradient(-45deg, {btn_background}, {btn_background_hover}); width: {btn_width};"
  disabled="{disabled}"
>
  <div class="link-btn-icon-container" style="background: {icon_background};">
    <!-- Icon -->
    <slot />
  </div>
  <div class="link-btn-value">
    {value}
  </div>
</button>

<style lang="scss">
  .disabled {
    color: #8c8c8c !important;
    background: rgba(255, 255, 255, 0.6) !important;
    border-bottom: solid rgba(140, 140, 140, 0.25) 2px;
    cursor: not-allowed !important;
  }

  $icon_size: 35px;
  $btn_background_animation_duration: 0.25s;
  .link-btn {
    height: $icon_size;
    border: none;
    outline: none;
    cursor: pointer;
    position: relative;
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    padding: 0px 0px 0px 40px;
    border-radius: 28.5px;

    background-size: 400% 400% !important;
    background-position: 100% 0% !important;
    transition: background-position $btn_background_animation_duration
      ease-in-out;
  }

  .link-btn:hover {
    background-position: 0% 50% !important;
    transition: background-position $btn_background_animation_duration
      ease-in-out;
  }

  $icon_animation_duration: 0.8s;
  .link-btn-icon-container {
    margin: auto;
    top: 0;
    left: -1px;
    right: 100%;
    bottom: 0;
    width: $icon_size;
    position: absolute;
    overflow: hidden;
    border-radius: 28.5px;
    display: flex;
    justify-content: center;
    transform: rotate(0deg);
    transition: transform $icon_animation_duration ease-in;
  }

  .link-btn:focus > .link-btn-icon-container {
    transform: rotate(360deg);
    transition: transform $icon_animation_duration ease-out;
  }

  $value_animation_duration: $icon_animation_duration;
  .link-btn-value {
    font-weight: 600;
    font-size: 16px;

    margin-left: -$icon_size/2;
    transform: translateX(0);
    transition: transform $value_animation_duration ease-in-out,
      font-weight $value_animation_duration ease-in-out;
  }

  /**
    Really small screen width
  */
  @media (max-width: 360px) {
    .link-btn-value {
      margin-left: -$icon_size;
    }
    .link-btn-icon-container {
      display: none;
    }
  }
</style>
