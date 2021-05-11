<script lang="ts">
  import BitText from "../BitText.svelte";
  import UserIcon from "../UserIcon.svelte";

  export let name: string;
  export let avatar: string;
  export let score: number;

  let icon_size = "2.5rem";
</script>

<tr class="player">
  <!-- User's Image -->
  <td class="user-icon" style="width: {icon_size}">
    <UserIcon
      src="{avatar}"
      size="{icon_size}"
      background="#2b6a34"
      border_color="#2b6a34"
    />
  </td>

  <!-- User's Name -->
  <td class="user-name">
    <p>{name}</p>
  </td>

  <!-- User's Points -->
  <td class="user-points">
    <BitText color="#2b6a34" fontSize="1.2rem" value="{score.toString()}" />
  </td>
</tr>

<style lang="scss">
  .user-icon {
    padding: 1rem;
  }

  .user-name {
    text-align: left;
  }
</style>
