<script lang="ts">
    import Text from "@components/Text.svelte";
</script>

<div>
    <Text value="Gevonden woorden" fontSize="1.7em"/>
    <div class="flex_container">
        <div class="list">
            <ul>
                <Text value="test"/>
                <Text value="dinges"/>
                <Text value="gurbe"/>
                <Text value="netgurbe"/>
                <Text value="gorge"/>
                <Text value="wolgorge"/>
                <Text value="beamstronk"/>
                <Text value="qwertyuiopasdfgh"/>
                <Text value="mhm"/>
                <Text value="klopt"/>
            </ul>
        </div>
        <div>
            <ul>
                <Text value="test"/>
                <Text value="dinges"/>
                <Text value="gurbe"/>
                <Text value="netgurbe"/>
                <Text value="gorge"/>
                <Text value="wolgorge"/>
                <Text value="beamstronk"/>
                <Text value="qwertyuiopasdfgh"/>
                <Text value="mhm"/>
                <Text value="klopt"/>
            </ul>
        </div>
    </div>
</div>

<style>
    ul{
        list-style-type: none;
        padding: 0;
    }
    .flex_container{
        display: flex;
        color: white;
    }
    .flex_container div{
        width: 50%;
    }
    .list{
        border-right: 3px solid white;
    }
    ul{
        font-size: 1.4rem;
        }
    @media only screen and (max-width: 450px){
        ul{
        font-size: 0.8rem;
        }
    }
</style>