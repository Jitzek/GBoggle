<script lang="ts">
    export let fontSize: string;
    export let value: string;
</script>

<p style="font-size: {fontSize}">{value}</p>

<style lang="scss">
    p {
        color: white;
        text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
        margin: 0;
    }
</style>