<script type="ts">
  import UserIcon from "@components/UserIcon.svelte";

  export let userIcon: string;
  export let userName: string;

  let icon_size = "2.5rem";
</script>

<table class="message-block">
  <tr class="user-info">
    <!-- User's Image -->
    <td class="user-icon" style="width: {icon_size}">
      <UserIcon
        src="{userIcon}"
        size="{icon_size}"
        background="#2b6a34"
        border_color="#2b6a34"
      />
    </td>
    <!-- User's Name -->
    <td class="user-name">
      <p>{userName}</p>
    </td>
  </tr>
  <!-- Messages -->
  <slot />
</table>

<style lang="scss">
  .message-block {
    height: 100%;

    .user-info {
      .user-name {
        font-weight: 600;
      }
      td:first-child {
        padding-right: 0.5rem;
      }
    }
  }
</style>
