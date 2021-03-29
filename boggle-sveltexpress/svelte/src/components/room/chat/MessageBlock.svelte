<script type="ts">
  import UserIcon from "@components/UserIcon.svelte";
  import Message from "@components/room/chat/Message.svelte";

  export let id;
  export let userId;

  let icon_size = "2.5rem";
</script>

<table class="message-block" id="{id}">
  <tr class="user-info">
    <!-- User's Image -->
    <td class="user-icon" style="width: {icon_size}">
      <UserIcon
        src="/images/hey.png"
        size="{icon_size}"
        background="#2b6a34"
        border_color="#2b6a34"
      />
    </td>
    <!-- User's Name -->
    <td class="user-name">
      <p>VSauce</p>
    </td>
    <input type="hidden" value="1" />
    <!-- User ID -->
  </tr>
  <slot />
</table>

<style lang="scss">
  .message-block {
    height: 100%;
  }
  .user-info {
    .user-name {
      font-weight: 600;
    }
    td:first-child {
      padding-right: 0.5rem;
    }
  }
</style>
