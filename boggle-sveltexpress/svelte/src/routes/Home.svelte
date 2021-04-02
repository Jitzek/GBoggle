<script>
    import BasicContainer from "../components/BasicContainer.svelte"
    import {TextInput} from "../components/inputs/index";
    import UploadButton from "../components/UploadButton.svelte";
    import LinkButton from "../components/LinkButton.svelte";
</script>
    <BasicContainer>
        <div class="start-container">
            <TextInput label="Nickname: "></TextInput>
            <div class="flexthis">
                <UploadButton acceptedfiletypes="image/*" id="image" labelName="Upload Avatar:"></UploadButton>
                <UploadButton acceptedfiletypes="audio/*" id="audio" labelName="Upload victory audio:"></UploadButton>
            </div>
            <div class="buttons">
                <LinkButton value="Singleplayer"></LinkButton>
                <LinkButton value="Multiplayer"></LinkButton>
                <LinkButton value="Create private room"></LinkButton>
            </div>
        </div>
    </BasicContainer>
<style>
    .flexthis{
        display: flex;
        justify-content: space-evenly;
    }
    .start-container{
        padding: 0 5rem 0 5rem;
    }
</style>