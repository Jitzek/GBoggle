<script lang="ts">
  import { Soundbars, Camera } from "@components/svg/index";
  import Text from "@components/Text.svelte";
  export let acceptedfiletypes: string;
  export let id: string;
  export let labelName: string = "Upload file";
  let filename: string = "";
  let localstorage = window.localStorage;
  let avatar: string = setFromLocalStorage("avatar");
  let filename_avatar: string = setFromLocalStorage("filename_avatar");
  let filename_victory_audio: string = setFromLocalStorage(
    "filename_victory_audio"
  );
  let victory_audio: string = setFromLocalStorage("victory_audio");
  let fileinput: any;
  acceptedfiletypes == "image/*"
    ? (filename = filename_avatar)
    : (filename = filename_victory_audio);
  const onFileSelected = (e) => {
    let file: File = e.target.files[0];
    if (file.size > 2000000) {
      alert("file too big!");
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      let shortname: string = file.name.split(".").shift();
      filename = shortenText(shortname, 15);
      if (acceptedfiletypes == "audio/*") {
        localstorage.setItem("victory_audio", e.target.result.toString());
        localstorage.setItem("filename_victory_audio", shortname);
      } else {
        avatar = e.target.result.toString();
        localstorage.setItem("avatar", avatar);
        localstorage.setItem("filename_avatar", shortname);
      }
    };
  };
  function setFromLocalStorage(key: string): string {
    if (key in localstorage) {
      return localstorage.getItem(key).toString();
    } else {
      return "";
    }
  }
  function shortenText(text: string, length: number): string {
    if (text.length > length) {
      text = text.slice(0, length);
      text += "...";
    }
    return text;
  }
</script>

<div class="upload-container">
  <div class="uploadbuttonlabel">
    <Text value="{labelName}" />
  </div>
  <div>
    {#if acceptedfiletypes == "image/*"}
      <label for="{id}">
        <div class="container">
          {#if avatar}
            <img
              src="{avatar}"
              alt="avatar"
              class="uploadbutton"
              on:click="{() => {
                fileinput.click();
              }}"
            />
            <div class="uploadbutton overlay">
              <Camera color="white" width="60%" />
            </div>
          {:else}
            <div
              class="uploadbutton labelstyle"
              on:click="{() => {
                fileinput.click();
              }}"
            ></div>
            <div class="uploadbutton overlay_no_hover">
              <Camera color="white" width="60%" />
            </div>
          {/if}
        </div>
      </label>
      <input
        type="file"
        id="{id}"
        class="upload"
        accept="{acceptedfiletypes}"
        on:change="{(e) => onFileSelected(e)}"
        bind:this="{fileinput}"
        bind:value="{avatar}"
      />
    {:else if acceptedfiletypes == "audio/*"}
      <label for="{id}">
        <div class="container">
          <div class="uploadbutton overlay_no_hover">
            <Soundbars color="white" width="60%" />
          </div>
          <div
            class="uploadbutton labelstyle"
            on:click="{() => {
              fileinput.click();
            }}"
          ></div>
        </div>
      </label>
      <input
        type="file"
        id="{id}"
        class="upload"
        accept="{acceptedfiletypes}"
        on:change="{(e) => onFileSelected(e)}"
        bind:this="{fileinput}"
        bind:value="{victory_audio}"
      />
    {/if}
  </div>
  <p>{filename}</p>
</div>

<style>
  @media only screen and (max-width: 700px) {
    .uploadbuttonlabel {
      font-size: 0.7rem;
    }
  }
  .uploadbuttonlabel {
    white-space: nowrap;
    margin: 20px 0px 20px 0px;
  }
  .container {
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
    .overlay {
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
  .overlay_no_hover {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    transition: 0.3s ease;
  }
  .overlay_no_hover:hover {
    background-color: rgba(102, 102, 102, 0.699);
  }
  label:hover .overlay {
    opacity: 1;
    z-index: 2;
  }
</style>