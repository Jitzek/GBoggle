<script lang="ts">
    export let color: string = "white";
    export let fontSize: string = "1rem";
    export let value: string = "";
    export let ref: string = "";
</script>

<p {ref} style="color: {color}; font-size: {fontSize}">{value}</p>

<style lang="scss">
    @font-face {
        font-family: '8bit';
        src: url("/fonts/Early-Gameboy.woff") format('woff');
    }

    p {
        font-family: '8bit';
        margin: 0;
        margin-top: 0.25rem;
    }
</style>