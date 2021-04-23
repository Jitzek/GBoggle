<script lang="ts">
    import BasicContainer from "@components/BasicContainer.svelte"
    import {TextInput, SelectInput, CheckboxInput} from "@components/inputs/index"
    import RoomBrowserRow from "@components/RoomBrowserRow.svelte"
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
        <RoomBrowserRow islocked={true} name="Gurbe sien server" lang="Dutch" total_players="16" max_players="16"/>
        <RoomBrowserRow islocked={false} name="Groezelige hollanders" lang="Dutch" total_players="0" max_players="12"/>
        <RoomBrowserRow islocked={true} name="Fryslân boppe" lang="Dutch" total_players="12" max_players="16"/>
        <RoomBrowserRow islocked={true} name="Gurbe sien server" lang="Dutch" total_players="16" max_players="16"/>
        <RoomBrowserRow islocked={false} name="Groezelige hollanders" lang="Dutch" total_players="0" max_players="12"/>
        <RoomBrowserRow islocked={true} name="Fryslân boppe" lang="Dutch" total_players="12" max_players="16"/>
        <RoomBrowserRow islocked={true} name="Gurbe sien server" lang="Dutch" total_players="16" max_players="16"/>
        <RoomBrowserRow islocked={false} name="Groezelige hollanders" lang="Dutch" total_players="0" max_players="12"/>
        <RoomBrowserRow islocked={true} name="Fryslân boppe" lang="Dutch" total_players="12" max_players="16"/>
        <RoomBrowserRow islocked={true} name="Gurbe sien server" lang="Dutch" total_players="16" max_players="16"/>
        <RoomBrowserRow islocked={false} name="Groezelige hollanders" lang="Dutch" total_players="0" max_players="12"/>
        <RoomBrowserRow islocked={true} name="Fryslân boppe" lang="Dutch" total_players="12" max_players="16"/>
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