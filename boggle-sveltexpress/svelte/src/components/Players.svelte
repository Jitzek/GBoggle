<script lang="ts">
  import BitText from "../components/BitText.svelte";
  import UserIcon from "../components/UserIcon.svelte";

  export let room_id: string;

  // TODO: Connect to room and get players

  let icon_size = "2.5rem";
</script>

<table class="players">
  <tr>
    <!-- User's Image -->
    <td class="user-icon" style="width: {icon_size}">
      <UserIcon src="/images/hey.png" size="{icon_size}" background="#2b6a34" border_color="#2b6a34" />
    </td>
    <!-- User's Name -->
    <td class="user-name">
      <p>Hey</p>
    </td>

    <!-- User's Points -->
    <td class="user-points">
      <BitText color="#2b6a34" fontSize="1.2rem" value="99999" />
    </td>
  </tr>
</table>

<style lang="scss">
  .user-icon {
    padding: 1rem;
  }

  .user-name {
    text-align: left;
  }

  .players {
    width: 100%;
  }
</style>
