<script lang="ts">
	import { getPostUserImage } from "@/api";
	import { onMount } from "svelte";

	let { authorId } = $props();
	let imageUrl: string | null = $state(null); // State for the image URL
	let isLoading = $state(true); // Track loading state

	$effect(() => {
		async function getData() {
			try {
				imageUrl = await getPostUserImage(authorId);
			} catch (error) {
				console.error("Error fetching user image:", error);
				imageUrl = null; // Handle error (e.g., fallback)
			} finally {
				isLoading = false; // Loading finished
			}
		}
		getData();
	});
</script>

{#if isLoading || !imageUrl}
	<div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
		<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
	</div>
{:else}
	<img src={imageUrl} alt="user profile" class="h-10 w-10 rounded-full" />
{/if}
