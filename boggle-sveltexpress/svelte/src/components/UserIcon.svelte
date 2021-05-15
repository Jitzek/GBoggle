<script lang="ts">
  export let background: string;
  export let border_color: string;

  export let src: string;
  export let size: string = "2.5rem";
  export let alt: string = "User Icon";
</script>

<div
  class="user-icon"
  style="height: {size}; width: {size}; background: {background}; border: 1px solid {border_color};"
>
  <img src="{src}" alt="{alt}" style="height: auto; width: {size};" />
</div>

<style lang="scss">
  .user-icon {
    border-radius: 100%;

    vertical-align: middle;

    display: inline-block;
    border-radius: 100%;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .user-icon img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
</style>
