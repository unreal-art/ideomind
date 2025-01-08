<script lang="ts">
	import { getPostUserImage } from "@/api";
	import { onMount } from "svelte";

	let { authorId } = $props();
	let imageUrl: string | null = $state(null); // State for the image URL
	let isLoading = $state(true); // Track loading state
 	const placeholderImage = '/default.jpg';

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
    <!-- Display a spinner or placeholder image -->
    <img src={placeholderImage} alt="placeholder" class="h-10 w-10 rounded-full" />
  {:else}
    <!-- Display the actual image -->
    <img src={imageUrl} alt="user profile" class="h-10 w-10 rounded-full" />
  {/if}