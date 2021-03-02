<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import { Room, NotFound } from "./routes/";
  import Text from  "./components/Text.svelte";

  export let url = window.location.pathname;
</script>

<main>
  <Text value="Test" fontSize="6rem"/>
  <Text value="Test" fontSize="2rem"/>
  <Router url="{url}">
    <Route path="/" />
    <Route path="room/:id" let:params>
      <Room id="{params.id}" />
    </Route>
    <Route component="{NotFound}" />
  </Router>
</main>

<style type="text/scss">
  :global(body) {
    background: linear-gradient(
      -45deg,
      rgba(250, 163, 34, 1) 0%,
      rgba(239, 59, 57, 1) 70%
    );
  }

  main {
    text-align: center;
    max-width: 75vw;
    margin: 0 auto;
  }

  @media (max-width: 1000px) {
    main {
      max-width: none;
    }
  }
</style>
