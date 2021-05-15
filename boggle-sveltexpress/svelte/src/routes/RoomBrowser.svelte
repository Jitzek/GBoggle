<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte"
    import {TextInput, SelectInput, CheckboxInput} from "@components/inputs/index"
    import RoomBrowserRow from "@components/RoomBrowserRow.svelte"
    import type {RoomProperties} from "../types/Types"; 
    import { onMount } from "svelte";
    import type { Socket } from "socket.io-client";

    export let socket: Socket;
    let rooms: RoomProperties[] = [];

    socket.emit("get_rooms");
    socket.on("get_rooms", (_rooms: RoomProperties[]) => {
        rooms = _rooms;
    });
    
    $: showRooms = rooms;
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