<script lang="ts">
    import BasicContainer from "../components/BasicContainer.svelte";
    import Text from "../components/Text.svelte";
</script>

<div>
    
    <BasicContainer>
        <Text fontSize="2.5rem" value="Room Settings" />
    </BasicContainer>

    <div style="margin-top: 4rem"></div>

    <Text fontSize="2.5rem" value="Invite Others!" />
    <div class="invite-container">
        <div class="invite-link-container">
            <span class="hover-me">Hover over here to see the invite link!</span>
            <span class="invite-link">Invite Link</span>
        </div>
        <div class="hover-btn-container">
            <button class="hover-btn">
                <Text  value="Copy" />
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    .invite-container {
        margin: auto;
        text-align: center;
        vertical-align: middle;
        display: table;
    }

    .hover-btn {
        background: rgb(255, 136, 0);;
        border: none;
        margin: 0 !important;
        padding: 0.5rem;
        cursor: pointer;
    }

    .hover-btn:active {
        background: rgb(255, 123, 0);
    }

    .hover-btn-container {
        display: table-cell;
    }

    .invite-link-container {
        background: white;
        color: rgb(255, 136, 0);
        width: 100%;
        display: table-cell;
    }

    .invite-link-container:hover {
        .invite-link {
            display: initial;
        }

        .hover-me {
            display: none;
        }
    }

    .invite-link {
        display: none;
        color: black;
    }
</style>