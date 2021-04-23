<script lang="ts">
    import {Soundbars, Camera} from "@components/svg/index";
    import Text from "@components/Text.svelte";

    export let acceptedfiletypes: string;
    export let id: string;
    export let labelName: string = "Upload file";
    let avatar: string | ArrayBuffer 
    let fileinput: any;

    const onFileSelected = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            let shortname: string = file.name.split('.').shift();
            if(shortname.length > 10){
                shortname = shortname.slice(0, 10);
                shortname += "...";
            }
            document.getElementById(id + id).innerHTML = shortname;
            if (acceptedfiletypes == "audio/*") return;
            avatar = e.target.result;
        };
    };
    
</script>

<div class="upload-container">
    <div class="uploadbuttonlabel">
        <Text value="{labelName}"></Text>
    </div>
    <div>
        <label for="{id}">
            <div class="container">
                {#if avatar}
                <img
                    src={avatar.toString()}
                    alt=""
                    class="uploadbutton"
                    on:click={() => {
                        fileinput.click();
                    }}
                />
            {:else}
                <div
                    class="uploadbutton labelstyle"
                    on:click={() => {               
                        fileinput.click();
                    }}
                />
            {/if}
            <div class="uploadbutton overlay">
                {#if acceptedfiletypes == "image/*"}
                <Camera color="white" width="60%"></Camera> 
                {:else if acceptedfiletypes == "audio/*"}
                <Soundbars color="white" width="60%"></Soundbars>
                {/if}
            </div>
            </div>
        </label>
        <input
            type="file"
            id="{id}"
            class="upload"
            accept={acceptedfiletypes}
            on:change={(e) => onFileSelected(e)}
            bind:this={fileinput}
        />
    </div>
    <p id={id+id}></p>
</div>

<style>
    @media only screen and (max-width: 700px) {
        .uploadbuttonlabel{
            font-size: 0.7rem;
    }
}

    .uploadbuttonlabel{
        white-space: nowrap;
        margin: 20px 0px 20px 0px;
    }

    .container{
        margin: 0 auto;
        display: grid;
        place-items: center;
        grid-template-areas: "inners";
    }

    .upload {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    .labelstyle {
        background-color: #3a3838;
    }
    .upload-container {
        width: 18rem;
    }
    .uploadbutton {
        border-radius: 50%;
        width: 175px;
        height: 175px;
        border: 3px solid #3a3838;
        object-fit: cover;
        grid-area: inners;
    }
    @media only screen and (max-width: 700px) {
    .uploadbutton {
        width: 80px;
        height: 80px;
    }
    .overlay{
        width: 75px;
        height: 75px;
    }
}
    label {
        display: flex;
        justify-content: center;
        cursor: pointer;
    }

    .overlay {
        background-color: rgba(102, 102, 102, 0.699);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: 0.3s ease;
        z-index: -1;
    }

    label:hover .overlay {
        opacity: 1;
        z-index: 2;
    }
</style>
