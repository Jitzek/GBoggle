<script lang="ts">
    export let size: string = "26rem";
    export let clickable: boolean;
</script>

<img style="width: {size};" class:clickable src="/images/gboggle-logo.png" alt="G-Boggle Logo" on:click />

<style lang="scss">
    img {
        height: auto;
        max-width: 100%;
    }

    img.clickable {
        cursor: pointer;
    }
</style>