<script>
    import BasicContainer from "@components/BasicContainer.svelte"
    import {TextInput} from "@components/inputs/index";
    import UploadButton from "@components/UploadButton.svelte";
    import LinkButton from "@components/LinkButton.svelte";
    import Leaderboard from "@components/Leaderboard.svelte"
    import {Users, User, Private} from "@components/svg/index";

    

</script>
    <BasicContainer>
        <div class="start-container">
            <TextInput label="Nickname: "></TextInput>
            <div class="flexthis">
                <UploadButton acceptedfiletypes="image/*" id="image" labelName="Upload Avatar:"></UploadButton>
                <UploadButton acceptedfiletypes="audio/*" id="audio" labelName="Upload victory audio:"></UploadButton>
            </div>
            <div class="buttons">
                <div class="topbuttons">
                    <LinkButton btn_width="45%" value="Singleplayer" btn_background="#46a350" href="game"><User width="20px" color="#46a350" /></LinkButton>
                    <LinkButton btn_width="45%" value="Multiplayer" btn_background="#2b6a34" href="roombrowser"><Users width="25px" color="#2b6a34" /></LinkButton>
                </div>
                <div class="bottombutton">
                    <LinkButton btn_width="80%" value="Create private room"btn_background="#13a8e0"><Private width="25px" color="#13a8e0"/></LinkButton>
                </div>
            </div>
        </div>
    </BasicContainer>
    <BasicContainer>
        <Leaderboard/>
    </BasicContainer>

<style>
    .flexthis{
        display: flex;
        justify-content: space-evenly;
    }
    .start-container{
        padding: 0 2rem 0 2rem;
    }
    .buttons{
        margin: 2rem 0 0 0;
    }
    .topbuttons{
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 1rem;
    }
</style>