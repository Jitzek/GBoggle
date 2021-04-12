<script lang="ts">
  import MessageBlock from "@components/room/chat/MessageBlock.svelte";
  import {Send} from "@components/svg/index";
  import Message from "@components/room/chat/Message.svelte";
  import { afterUpdate } from "svelte";

  export let roomId: string;

  // TODO: Connect to room and get players

  let chatContainer: HTMLElement;
  let messageBlocks: Object[] = [];

  let newMessagesButton: HTMLButtonElement;
  let newMessagesButtonWidth: string = "8rem";

  let scrollDif = 0;


  afterUpdate(() => {
    // Only autoscroll if the user is already at bottom of the chat
    let autoScroll = chatContainer.scrollTop == scrollDif;
    scrollDif = chatContainer.scrollHeight - chatContainer.clientHeight;
    if (autoScroll) {
      // Auto scroll after Lifecycle Update
      scrollToBottom();
    } else {
      showNewMessagesButton();
    }
  });

  function showNewMessagesButton() {
    newMessagesButton.style.visibility = "visible";
    newMessagesButton.style.right = "0";
  }

  function hideNewMessagesButton() {
    newMessagesButton.style.visibility = "hidden";
    newMessagesButton.style.right = `-${newMessagesButtonWidth}`;
  }

  function scrollToBottom() {
    hideNewMessagesButton();
    chatContainer.scrollTop = chatContainer.scrollHeight - chatContainer.clientHeight;
  }


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

<div class="chat-container" bind:this="{chatContainer}">
  <div class="chat">
    <div class="messages">
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
    <button bind:this="{newMessagesButton}" class="new-messages-btn" on:click="{scrollToBottom}" style="width: {newMessagesButtonWidth}" />
    <div class="send-message">
      <input type="text" />
      <button>
        <Send width="1.75rem" />
      </button>
    </div>
  </div>
</div>

<style lang="scss">
  .chat-container {
    position: fixed;
    height: 100%;
    width: 100%;
    overflow-y: auto;

    .chat {
      .new-messages-btn {
        position: fixed;
        right: 0;
        bottom: 4rem;

        visibility: hidden;

        color: white;
        background: #7f3f98;
        border: none;
        border-radius: 6px;

        cursor: pointer;

        transition: all 0.75s;
      }

      .new-messages-btn::before {
        content: "New Messages!";
      }

      .new-messages-btn:hover::before {
        content: "Scroll to Bottom";
      }

      .messages {
        padding: 1rem;
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
  }
</style>
