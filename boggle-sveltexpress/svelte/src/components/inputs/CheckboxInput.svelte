<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value: string;
    export let checked;
    
</script>

<label>
    <input type="checkbox" value="{value}" bind:checked on:change={() => {
        dispatch(
            'message',
        )
    }}>
    {value}
</label>