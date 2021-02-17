<script lang="ts">
    export let acceptedfiletypes: string;
   let avatar, fileinput;

   const onFileSelected = (e) => {
       let file = e.target.files[0];
       let reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = e => {
        document.getElementById("filename").innerHTML = file.name;
           if(acceptedfiletypes == "audio/*") return
            avatar = e.target.result
       };
   }


</script>
<div>
    <h1>test</h1>
    <div class="container">
        <label for="upload">
            {#if avatar}
                <img src="{avatar}" alt="" class="uploadbutton" on:click={() => {
                    fileinput.click();
                }}>
            {:else}
                <div id="labelstyle" class="uploadbutton" on:click={() => {
                    fileinput.click();
                }}></div>
            {/if}
            <div id="overlay" class="uploadbutton">
                <slot />
            </div>
        </label>
        <input type="file" id="upload" accept="{acceptedfiletypes}" on:change={(e)=>onFileSelected(e)} bind:this={fileinput}/>
    </div>
    <h2 id="filename">test2</h2>
</div>

<style>
    #upload {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    #labelstyle {
        background-color: #3a3838;
    }
    .uploadbutton{
        border-radius: 50%;
        width: 175px;
        height: 175px;
        position: absolute;
        border: 3px solid #3a3838;
    }
    label{
        display: flex;
        justify-content: center;
        cursor: pointer;
    }
    #overlay {
        background-color: rgba(102, 102, 102, 0.699);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: 0.3s ease;
        z-index: -1;
    }
    label:hover #overlay {
        opacity: 1;
        z-index: 2;
    }
    .container{
        height: 175px;
    }
</style>
