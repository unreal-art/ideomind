<script lang="ts">
	import { getImageUrl } from "@/api";
	let DEFAULT_IMAGE = "/assets/loading.png"; // Default fallback image
	let { item } = $props(); // Get `item` from props
	let imageUrl = $state(""); // State for the image URL
	let isLoading = $state(true); // Track whether the image is loading

	// Function to fetch the image
	const getImage = async (cid: string) => {
		try {
			imageUrl = import.meta.env.VITE_LIGHTHOUSE_GATE_WAY + item.ipfsImages[0].hash+'/' + item.ipfsImages[0].fileNames[0]
		} catch (error) {
			console.error("Error fetching image:", error);
			imageUrl = ""; // Use fallback image on fetch error
		} finally {
			isLoading = false; // Hide loading spinner once image is resolved
		}
	};

	// Fetch the image when the component initializes
	$effect(() => {
		getImage(item.ipfsImages[0].hash);
	});


	

	// Function to handle image load errors
	function handleImageError(event: Event) {
		const target = event.target as HTMLImageElement;
		target.src = DEFAULT_IMAGE;
		isLoading = false; // Stop loading indicator
	}
</script>

{#if isLoading || !imageUrl}
	<div class="flex h-full items-center justify-center bg-gray-100">
		<div class="flex items-center space-x-2">
			<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
			<span class="font-medium text-gray-600">Loading...</span>
		</div>
	</div>
{:else}
	<!-- Image -->
	<a href={`/details/${item.id}`}>
		<img
			src={imageUrl}
			alt="user profile"
			class={`w-full rounded-sm transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
			onerror={handleImageError}
			onload={() => (isLoading = false)}
		/>
	</a>
{/if}
