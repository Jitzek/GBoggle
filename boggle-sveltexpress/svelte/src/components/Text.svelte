<script lang="ts">
  export let color: string = "white";
  export let fontSize: string = "none";
  export let value: string;
</script>

<p style="color: {color}; font-size: {fontSize}">{value}</p>

<style lang="scss">
  p {
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    margin: 0;
  }
</style>
