<script lang="ts">
  import BitText from "../BitText.svelte";
  import UserIcon from "../UserIcon.svelte";

  export let name: string;
  export let avatar: string;
  export let score: number;

  export let icon_size = "2.5rem";
  export let name_color = "#000";
  export let score_color = "#2b6a34";
  export let text_size = "1.2rem";
  export let background_color = "#2b6a34";
</script>

<tr class="player">
  <!-- User's Image -->
  <td class="user-icon" style="width: {icon_size}">
    <UserIcon
      src="{avatar}"
      size="{icon_size}"
      background="{background_color}"
      border_color="{background_color}"
      alt=""
    />
  </td>

  <!-- User's Name -->
  <td class="user-name">
    <p style="color: {name_color}">{name}</p>
  </td>

  <!-- User's Points -->
  <td class="user-points">
    <BitText color="{score_color}" fontSize="{text_size}" value="{score.toString()}" />
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
