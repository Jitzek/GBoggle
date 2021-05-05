<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte"
    import {TextInput, SelectInput, CheckboxInput} from "@components/inputs/index"
    import RoomBrowserRow from "@components/RoomBrowserRow.svelte"
    import type {RoomProperties} from "../types/Types"; 
    import { onMount } from "svelte";
    
    export let rooms: RoomProperties[] = [
        {isLocked: true, name: "Gurbe", lang: "Dutch", totalPlayers: 16, maxPlayers: 16},
        {isLocked: false, name: "Henk", lang: "English", totalPlayers: 3, maxPlayers: 16},
        {isLocked: true, name: "Boeke", lang: "Frisian", totalPlayers: 5, maxPlayers: 16},
        {isLocked: false, name: "Durk", lang: "French", totalPlayers: 5, maxPlayers: 16},
        {isLocked: true, name: "Gerben", lang: "German", totalPlayers: 1, maxPlayers: 16},
        {isLocked: false, name: "Gorge", lang: "Dutch", totalPlayers: 6, maxPlayers: 16},
        {isLocked: true, name: "Hans", lang: "Dutch", totalPlayers: 3, maxPlayers: 16},
        {isLocked: false, name: "Dien mem", lang: "Dutch", totalPlayers: 6, maxPlayers: 16},
        {isLocked: true, name: "Net dien mem", lang: "Dutch", totalPlayers: 0, maxPlayers: 16},
        {isLocked: true, name: "hah", lang: "Dutch", totalPlayers: 9, maxPlayers: 16},
        {isLocked: true, name: "mhm", lang: "Dutch", totalPlayers: 0, maxPlayers: 16}
    ];
    $: showRooms = [];
    onMount(filterRooms);

    let notPasswordProtected: boolean = false;
    let notFull: boolean = false;
    let notEmpty: boolean = false;
    let language: string = "Any";
    function filterRooms() {
        showRooms = rooms;
        if(notPasswordProtected){
            showRooms = showRooms.filter((room) => !room.isLocked);
        }
        if(notEmpty){
            showRooms = showRooms.filter((room) => room.totalPlayers != 0);
        }
        if(notFull){
            showRooms = showRooms.filter((room) => room.maxPlayers != room.totalPlayers);
        }
        if(language != "Any")
            showRooms = showRooms.filter((room) => room.lang == language)
    }
</script>
    <BasicContainer>
        <BasicContainer>
            <div class="inputcontainer">
                <TextInput label="Search room"/>
                <div class="checkboxcontainer">
                    <CheckboxInput value="Is not password protected" bind:checked={notPasswordProtected} on:message={filterRooms}/>
                    <CheckboxInput value="Room not full" bind:checked={notFull} on:message={filterRooms}/>
                    <CheckboxInput value="Room not empty" bind:checked={notEmpty} on:message={filterRooms}/>
                </div>
                <SelectInput label="Language" on:message={filterRooms} bind:selected={language}>
                    <option value="Any">Any</option>
                    <option value="English">English</option>
                    <option value="Dutch">Dutch</option>
                    <option value="French">French</option>
                    <option value="Frisian">Frisian</option>
                    <option value="German">German</option>
                </SelectInput>
            </div>
        </BasicContainer>
        <div class="roomscontainer">
            {#each showRooms as room, i (room)}
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
        padding: 0 10px 0 10px;
    }
</style>