<script lang="ts">
	import pic from '$lib/assets/ima1.jpg';
	import Button from '@/components/ui/button/button.svelte';
	// import { inAppWallet } from 'thirdweb/wallets';
	// import client from '$lib/client';
	// const wallet = inAppWallet();
	// import {} from 'thirdweb/chains';
	// import { defineChain } from 'thirdweb';
	import { goto } from '$app/navigation';
	import { getImageUrl, initializeStore } from '@/api';
	import { store } from '$lib/store';
	import type { Post } from '@/types';

	let imageUrl = $state('/assets/ima1.jpg');
	async function connect() {
		// account = await wallet.connect({
		// 	client,
		// 	chain: myChain,
		// 	strategy: 'google'
		// });
		goto('/explore');
	}

	initializeStore();

	// Array of image sources to cycle through
	let imageSources: Post[] = $derived($store.posts.slice(0, 10));

	let currentIndex = $state(0); // Track the current image index
	let fadeClass = $state('opacity-100'); // Initial opacity for fade effect

	const getImage = async (cid: any) => {
		imageUrl = (await getImageUrl(cid)) as string;
	};

	// Function to change the image source every 4 seconds
	const changeImageSource = () => {
		fadeClass = 'opacity-0'; // Start fading out
		setTimeout(() => {
			currentIndex = (currentIndex + 1) % imageSources.length; // Change the image index
			getImage(imageSources[currentIndex].ipfsImages[0].cid);
			fadeClass = 'opacity-100'; // Fade in the new image
		}, 3000); // Wait for 300ms before changing the image to create a smooth transition
	};

	// Set interval to change the image every 4 seconds
	$effect(() => {
		const intervalId = setInterval(changeImageSource, 4000);

		// Cleanup the interval when the component is destroyed
		return () => clearInterval(intervalId);
	});
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="flex h-3/4 w-[90%] max-w-[400px] flex-col gap-3">
		<div class="flex w-full items-center space-x-3 text-xl font-semibold">Unreal-Art</div>

		<!-- <enhanced:img src={img} alt="landing page image  " /> -->
		<img
			src={imageUrl}
			alt="home page"
			class={`transition-opacity duration-300 ease-in-out ${fadeClass} h-[400px] w-[400px] rounded-md object-cover`}
		/>

		<div class="h-[10%] w-full text-center">
			<Button onclick={connect} class="text-md h-12 w-full">Get Started</Button>
		</div>
	</div>
</main>
