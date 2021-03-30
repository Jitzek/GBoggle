<script lang="ts">
  import MessageBlock from "@components/room/chat/MessageBlock.svelte";
  import SendIcon from "@components/svg/send.svelte";
  import Message from "@components/room/chat/Message.svelte";
  import { afterUpdate } from "svelte";

  export let roomId: string;

  // TODO: Connect to room and get players

  let messagesElement: HTMLElement;
  let messageBlocks: Object[] = [];

  let autoScroll: boolean = true;

  afterUpdate(() => {
    if (autoScroll) {
      // Auto scroll after Lifecycle Update
      messagesElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });

  function onMessage(userId: string, message: string) {
    // Get current messageblock
    let c_m_block: Object = messageBlocks[messageBlocks.length - 1];

    if (!c_m_block || c_m_block["userId"] !== userId) {
      // Message from a new user, Create new Messageblock
      appendMessageBlock(userId);
      c_m_block = messageBlocks[messageBlocks.length - 1];
    }

    // Add message to the newest messageblock
    addMessage(message, messageBlocks[messageBlocks.length - 1]);
  }

  function appendMessageBlock(userId: string) {
    // TODO, use userId and roomId to get userName and userIcon
    let userName: string = "VSauce";
    let userIcon: string = "/images/hey.png";

    messageBlocks.push({
      userId: userId,
      userName: userName,
      userIcon: userIcon,
      messages: [],
    });
  }

  function addMessage(message: string, messageBlock: Object) {
    messageBlock["messages"].push(message);

    // State changed, request UI update
    messageBlocks = messageBlocks;
  }
</script>

<div class="chat">
  <div class="options">
    <label for="auto-scroll"
      >Auto Scroll <input
        bind:checked="{autoScroll}"
        id="auto-scroll"
        type="checkbox"
      /></label
    >
  </div>
  <div class="messages" bind:this="{messagesElement}">
    {#each messageBlocks as messageBlock}
      <MessageBlock
        id="{messageBlock['id']}"
        userId="{messageBlock['userId']}"
        userName="{messageBlock['userName']}"
        userIcon="{messageBlock['userIcon']}"
      >
        {#each messageBlock["messages"] as message}
          <Message message="{message}" />
        {/each}
      </MessageBlock>
    {/each}
  </div>
  <div class="send-message">
    <input type="text" />
    <button>
      <SendIcon width="1.75rem" />
    </button>
  </div>
</div>

<style lang="scss">
  .chat {
    .options {
      background: #7f3f98;
      border-radius: 2rem;
      margin: 0.5rem 1.25rem 0 0;
      padding: 0.75rem;
      position: fixed;
      right: 0;
      z-index: 1;

      $checkbox_size: 1.35;
      input[type="checkbox"] {
        margin-left: 0.15rem;
      }
      @supports (zoom: $checkbox_size) {
        input[type="checkbox"] {
          zoom: $checkbox_size;
        }
      }
      @supports not (zoom: $checkbox_size) {
        input[type="checkbox"] {
          -ms-transform: scale($checkbox_size);
          -moz-transform: scale($checkbox_size);
          -webkit-transform: scale($checkbox_size);
          -o-transform: scale($checkbox_size);
          transform: scale($checkbox_size);
          margin-left: 0.15rem;
        }
      }
      label {
        font-weight: 700;
        color: white;
      }

      label:hover {
        cursor: pointer;
      }
    }

    .messages {
      padding: 1rem;
      padding-top: 2rem;
      padding-bottom: 10rem;
      position: relative;
      text-align: left;
    }

    .send-message {
      border-radius: 0px;
      bottom: 0;
      display: flex;
      font-size: 1em;
      position: fixed;
      width: 100%;

      input,
      button {
        box-sizing: content-box;
        font-size: inherit;
        height: 2rem;
        -moz-box-sizing: content-box;
        -webkit-box-sizing: content-box;
      }

      input {
        min-width: 0px;
        outline: none;
        width: 270px;
      }

      input: {
        border: initial;
      }

      button {
        background: white;
        width: 50px;
      }
    }
  }
</style>
