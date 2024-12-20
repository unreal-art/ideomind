<script lang="ts">
	import { getPostUserImage } from "@/api";
	import { onMount } from "svelte";

	let { authorId } = $props();
	let imageUrl: string | null = $state(null);

	$effect(() => {
		async function getData() {
			imageUrl = await getPostUserImage(authorId);
		}
		getData();
	});
</script>

<img src={imageUrl} alt="user profile" class="h-full rounded-full" />
