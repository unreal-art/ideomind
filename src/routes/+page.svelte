<script lang="ts">
	import pic from "$lib/assets/ima1.jpg";
	import Button from "@/components/ui/button/button.svelte";
	// import { inAppWallet } from 'thirdweb/wallets';
	// import client from '$lib/client';
	// const wallet = inAppWallet();
	// import {} from 'thirdweb/chains';
	// import { defineChain } from 'thirdweb';
	import { goto } from "$app/navigation";
	import { getImageUrl, initializeStore } from "@/api";
	import { store } from "$lib/store";
	import type { Post } from "@/types";
	import { supabase } from "../supabaseClient";
import { AiOutlineDiscord , AiOutlineGooglePlus, AiOutlineNodeExpand} from 'svelte-icons-pack/ai';
import { Icon } from 'svelte-icons-pack';

let imageCache = $state(new Map<string, string>()); // Cache for storing image URLs
let imageUrl = $state(""); // State for the current image URL
let fadeClass = $state("opacity-100"); // State for fade effect
let currentIndex = $state(0); // Tracks the current index of the image
let imageSources: Post[] = $derived($store.posts.slice(0, 10));// Array of image sources
let intervalId: number | null = null; // Store interval ID to manage the loop



	// async function connect() {
	// 	// account = await wallet.connect({
	// 	// 	client,
	// 	// 	chain: myChain,
	// 	// 	strategy: 'google'
	// 	// });
	// 	goto('/explore');
	// }

	// Array of image sources to cycle through
	
// Function to fetch the image or get it from cache
const getImage = async (cid: string) => {
	if (imageCache.has(cid)) {
		// Retrieve the cached URL if it exists
		imageUrl = imageCache.get(cid) as string;
	} else {
		// Fetch the URL and store it in the cache
		const url = (await getImageUrl(cid)) as string;
		imageCache.set(cid, url);
		imageUrl = url;
	}
};



// Function to start the image rotation
const startImageRotation = () => {
	if (intervalId) return; // Prevent multiple intervals

	intervalId = window.setInterval(() => {
		 // Start fading out
		setTimeout(() => {
			currentIndex = (currentIndex + 1) % imageSources.length;
			const nextCid = imageSources[currentIndex].ipfsImages[0].cid;
			getImage(nextCid); // Fetch the new image
			 // Fade in the new image
		}, 300); // 300ms delay for smooth transition
	}, 4000); // Change image every 4 seconds
};



	async function signInWithGoogle() {
	const redirectToUrl = import.meta.env.DEV ? import.meta.env.VITE_DEV_BASE_URL : import.meta.env.VITE_PROD_BASE_URL;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
			//redirect url
            redirectTo: redirectToUrl + "/explore", 
        },
    });

    if (error) {
        console.error('Error signing in with Discord:', error.message);
    }
	}
async function signInWithDiscord() {
	
    const redirectToUrl = import.meta.env.DEV ? import.meta.env.VITE_DEV_BASE_URL : import.meta.env.VITE_PROD_BASE_URL;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
			//redirect url
            redirectTo: redirectToUrl + "/explore", 
        },
    });

    if (error) {
        console.error('Error signing in with Discord:', error.message);
    }
}

function handleImageError(event: Event) {
		const target = event.target as HTMLImageElement;
		target.src = "";
	 // Stop loading indicator
	}

	// Function to stop image rotation
const stopImageRotation = () => {
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
};

	// Initialize and start image rotation when `imageSources` are available
$effect(() => {
	if (imageSources.length > 0) {
		getImage(imageSources[currentIndex]?.ipfsImages[0]?.cid); // Load the first image
		startImageRotation(); // Start rotating images
	}

	return stopImageRotation; // Cleanup on component unmount
});

</script>

<main class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="flex h-2/4 w-[90%] max-w-[800px] flex-col gap-3">
		<div class="flex w-full items-center space-x-3 text-xl font-semibold">Unreal-Art</div>

		<!-- <enhanced:img src={img} alt="landing page image  " /> -->
		<div class="flex h-[90%] w-full flex-col gap-2 lg:flex-row">
			<div class="flex h-full w-full items-center lg:w-[50%]">

				{#if  !imageUrl}
	<div class="flex h-full w-full items-center justify-center bg-gray-100">
		<div class="flex items-center space-x-2">
			<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
			<span class="font-medium text-gray-600">Loading...</span>
		</div>
	</div>
{:else}
				<img
					src={imageUrl ? imageUrl :"/assets/ima1.jpg"}
					alt="home page"
					onerror={handleImageError}
					class={`transition-opacity duration-300 ease-in-out  h-full w-full rounded-md object-cover`}
				/>
				{/if}
			</div>

			<div
				class="flex h-full w-full flex-col items-center justify-center gap-3 text-center lg:w-[50%]"
			>
			

				<p class="text-md text-center font-semibold">Get started</p>
				<button onclick={signInWithDiscord} class=" h- w-full flex items-center justify-center gap-3 bg-primary rounded-md text-white fonr-semibold  text-center h-12  "> <Icon src={AiOutlineDiscord} size="28" viewBox="0 0 1024 1024" className="custom-icon" title="Custom icon params" />Discord</button>
				<button onclick={signInWithGoogle} class=" h- w-full flex items-center justify-center gap-3 bg-primary rounded-md text-white fonr-semibold  text-center h-12  "> <Icon src={AiOutlineGooglePlus} size="28" viewBox="0 0 1024 1024" className="custom-icon" title="Custom icon params" />Google</button>
				
			</div>
		</div>
	</div>
</main>
