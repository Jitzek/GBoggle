<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io("http://localhost:8000");

	socket.on("connect", (socket: any) => {
		console.log("Connected");
	});
</script>

<main>
	<h1>Hello World</h1>
</main>

<style type="text/scss">
	$color: red;

	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: $color;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>