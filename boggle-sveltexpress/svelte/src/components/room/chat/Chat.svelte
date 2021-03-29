<script lang="ts">
  import MessageBlock from "@components/room/chat/MessageBlock.svelte";
  import SendIcon from "@components/svg/send.svelte";
  import Message from "@components/room/chat/Message.svelte";
  import { afterUpdate } from 'svelte';


  export let room_id: string;

  // TODO: Connect to room and get players

  let messagesElement: HTMLElement;

  let messageBlocks: Object[] = [];

  afterUpdate(() => {
    // Auto scroll after Lifecycle Update
    messagesElement.scrollIntoView({behavior: 'smooth', block: 'end'});
  });

  function onMessage(userId: string, message: string) {
    // Get current messageblock, if there aren't any messageblocks add one instead
    let c_m_block = messageBlocks[messageBlocks.length - 1] || addMessageBlock(0, userId);
    // If a messageblock exists, check if the new message has been send by a new user
    if (c_m_block && c_m_block["userId"] !== userId) {
      // Message from new user, Create new Messageblock
      addMessageBlock(c_m_block["id"] + 1, userId);
    }
    // Add message to the newest messageblock
    addMessage(message, messageBlocks[messageBlocks.length - 1]["id"]);
  }

  function addMessageBlock(id: number, userId: string) {
    messageBlocks.push({
      id: id,
      userId: userId,
      messages: []
    });
  }

  function addMessage(message: string, messageBlockId: number) {
    // Find the messageblock with the given ID and add to it the given message
    messageBlocks.find(m_block => m_block["id"] === messageBlockId)["messages"].push(message);
    
    // State changed, request UI update
    messageBlocks = messageBlocks;
  }

  let icon_size = "2.5rem";

</script>

<div class="chat">
  <button on:click="{() => onMessage("user1", "Hello There")}">On Message 1</button>
  <button on:click="{() => onMessage("user2", "General Kenobi, You are a bold one")}">On Message 2</button>
  <div class="messages" bind:this="{messagesElement}">
    {#each messageBlocks as messageBlock}
      <MessageBlock id="{messageBlock["id"]}" userId="{messageBlock["userId"]}">
        {#each messageBlock["messages"] as message}
          <Message message="{message}"/>
        {/each}
      </MessageBlock>
    {/each}

    <!-- <MessageBlock id="0" userId="0">
      <Message id="0" message="Hey, Vsauce. Michael here. Where are your fingers? Seriously. 
      It's a pretty easy question. You should be able to answer it. 
      But how do you know? How does anyone know anything?" />
    </MessageBlock> -->
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
    .messages {
      position: relative;
      // overflow-y: auto;
      padding: 1rem;
      padding-bottom: 10rem;
      text-align: left;
    }

    .send-message {
      position: fixed;
      bottom: 0;
      font-size: 1em;
      border-radius: 0px;
      display: flex;
      width: 100%;

      input,
      button {
        height: 2rem;
        font-size: inherit;
        -moz-box-sizing: content-box;
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
      }

      input {
        width: 270px;
        min-width: 0px;
      }

      button {
        background: white;
        width: 50px;
      }
    }
  }
</style>
