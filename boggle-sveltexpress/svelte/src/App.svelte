<script lang="ts">
  import { io } from "socket.io-client";

  import { Router, Route } from "svelte-routing";
  import { Room, NotFound, Home, RoomBrowser } from "@routes";
  import GboggleLogo from "@components/GBoggleLogo.svelte";
  import { setCookie } from "./utils/cookies";
  import type { Socket } from "socket.io-client";

  export let url = window.location.pathname;

  const socket = io("http://localhost:8000");

  socket.on("connect", () => {
    console.log("connected");
  });

  // const socket = io("http://localhost:8000");

  // socket.on("connect", () => {
  //   console.log("connected");
  //   socket.emit("create_room", "Henk", "", "");
  //   socket.emit("join_room", "test", "Henk2", "", "");
  // });

  // socket.on("message", (message) => {
  //   console.log(`received message: ${message}`);
  //   socket.emit("message", "thank you for the message!");
  // });
</script>

<main>
  <GboggleLogo size="20rem" />
  <Router url="{url}">
    <Route path="/">
      <Home socket="{socket}" />
    </Route>
    <Route path="room/:id" let:params>
      <Room id="{params.id}" socket="{socket}" />
    </Route>
    <Route path="/roombrowser" component="{RoomBrowser}" />
    <Route component="{NotFound}" />
  </Router>
</main>

<style type="text/scss">
  :global(body) {
    background: linear-gradient(
      135deg,
      rgba(250, 163, 34, 1) 0%,
      rgba(239, 59, 57, 1) 70%
    );
    background-repeat: no-repeat;
    background-attachment: fixed;
    padding: 0;
  }

  main {
    text-align: center;
    width: 60vw;
    margin: 0 auto;
  }

  @media (max-width: 1000px) {
    main {
      max-width: none;
      width: 90vw;
    }
  }
  @media (max-width: 300px) {
    main {
      width: 100vw;
    }
  }
</style>
