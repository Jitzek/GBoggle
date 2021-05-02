<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte"
    import {TextInput, SelectInput, CheckboxInput} from "@components/inputs/index"
    import RoomBrowserRow from "@components/RoomBrowserRow.svelte"
    import type {RoomProperties} from "../types/RoomProperties";

    export let rooms: RoomProperties[] = [
        {isLocked: true, name: "Gurbe", lang: "Dutch", totalPlayers: 16, maxPlayers: 16},
        {isLocked: false, name: "Henk", lang: "Dutch", totalPlayers: 3, maxPlayers: 16},
        {isLocked: true, name: "Boeke", lang: "Dutch", totalPlayers: 5, maxPlayers: 16},
        {isLocked: false, name: "Durk", lang: "Dutch", totalPlayers: 5, maxPlayers: 16},
        {isLocked: true, name: "Gerben", lang: "Dutch", totalPlayers: 1, maxPlayers: 16},
        {isLocked: false, name: "Gorge", lang: "Dutch", totalPlayers: 6, maxPlayers: 16},
        {isLocked: true, name: "Hans", lang: "Dutch", totalPlayers: 3, maxPlayers: 16},
        {isLocked: false, name: "Dien mem", lang: "Dutch", totalPlayers: 6, maxPlayers: 16},
        {isLocked: true, name: "Net dien mem", lang: "Dutch", totalPlayers: 9, maxPlayers: 16},
    ]

    let roomProperties: RoomProperties = {isLocked: true, name: "Gurbe", lang: "Dutch", totalPlayers: 16, maxPlayers: 16};
</script>

<BasicContainer>
    <BasicContainer>
        <div class="inputcontainer">
            <TextInput label="Search room"/>
            <div class="checkboxcontainer">
                <CheckboxInput value="Is not password protected"/>
                <CheckboxInput value="Room not full"/>
                <CheckboxInput value="Room not empty"/>
            </div>
            <SelectInput label="Language">
                <option>Any</option>
                <option>English</option>
                <option>Dutch</option>
                <option>French</option>
                <option>Frisian</option>
                <option>German</option>
            </SelectInput>
        </div>
    </BasicContainer>
    <div class="roomscontainer">
        {#each rooms as room}
            <RoomBrowserRow roomProperties={room}/>
        {/each}
    </div>
</BasicContainer>

<style>
    .inputcontainer{
        padding: 0.6rem 2rem 0.6rem 2rem;
    }
    .checkboxcontainer{
        text-align: left;
        margin: 0.5rem 0 0.5rem 0;
    }
    .roomscontainer{
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 50vh;
    }
</style>