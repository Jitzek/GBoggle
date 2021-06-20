<script lang="ts">
  import BasicContainer from "@components/BasicContainer.svelte";
  import { Lock, NL, Users } from "@components/svg/index";
  import Text from "@components/Text.svelte";
  import type { RoomProperties } from "../types/Types";
  import { setCookie } from "../utils/cookies";
  import { navigate } from "svelte-routing";

  export let roomProperties: RoomProperties;
  let { id, isLocked, name, lang, totalPlayers, maxPlayers }: RoomProperties =
    roomProperties;

  function onRowClick() {
    // Join Room
    setCookie("room_id", id);
    navigate(`/room/${id}`, { replace: true });
  }
</script>

<BasicContainer style="border-radius: 0.6rem; cursor:pointer;">
  <table class="rooms" on:click="{onRowClick}">
    <tr>
      <td class="password_protected">
        {#if isLocked}
          <Lock width="30px" />
        {/if}
      </td>
      <td class="Room_name">
        <Text value="{name}" />
      </td>
      <td class="language">
        {#if lang == "Dutch"}
          <NL width="30px" />
        {:else if lang == "Frisian"}
          <!-- insert Frisian flag -->
        {:else if lang == "English"}
          <!-- insert English flag -->
        {:else if lang == "German"}
          <!-- insert German flag -->
        {:else if lang == "French"}
          <!-- insert French flag -->
        {/if}
      </td>
      <td class="total_players">
        <Text value="{totalPlayers}/{maxPlayers}" />
      </td>
      <td class="players_icon">
        <Users width="30px" color="white" />
      </td>
    </tr>
  </table>
</BasicContainer>

<style>
  .rooms {
    width: 100%;
    table-layout: fixed;
    margin: 10px;
    padding: 5px;
  }
  .password_protected {
    width: 10%;
  }
  .Room_name {
    width: 30%;
    white-space: nowrap;
    overflow: hidden;
  }
  .language {
    width: 10%;
  }
  .total_players {
    width: 10%;
    text-align: right;
  }
  .players_icon {
    width: 10%;
  }
</style>
