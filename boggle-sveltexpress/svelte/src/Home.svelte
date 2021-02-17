<script>
    import UploadButton from "./components/UploadButton.svelte";
    import CameraSvg from "./components/svg/camera.svelte";
    import SoundbarSvg from "./components/svg/soundbars.svelte"
</script>
<div>
    <h1>Welcome Home!</h1>
    <!-- Uploadbutton: use image/* and audio/* -->
    <UploadButton acceptedfiletypes="audio/*"><SoundbarSvg color="white"/></UploadButton>
</div>
<style>
</style>