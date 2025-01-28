<script lang="ts">
	
	import { goto } from "$app/navigation";
	import { store } from "$lib/store";
	import type { Post } from "@/types";
	import { AiOutlineApple, AiOutlineDiscord, AiOutlineGooglePlus, AiOutlineNodeExpand } from "svelte-icons-pack/ai";
	import { Icon } from "svelte-icons-pack";
	import { getRedirectURL } from "../oauth";
	import { supabase } from "@src/supabaseClient";
	import type { PageData } from "./$types";
	import { PUBLIC_LIGHTHOUSE_GATE_WAY } from "$env/static/public";

	// import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let imageCache = $state(new Map<string, string>()); // Cache for storing image URLs
	let imageUrl = $state(""); // State for the current image URL
	let fadeClass = $state("opacity-100"); // State for fade effect
	let currentIndex = $state(0); // Tracks the current index of the image
	let imageSources: Post[] = $derived($store.posts.slice(0, 10)); // Array of image sources
	let intervalId: number | null = null; // Store interval ID to manage the loop

	


	//handle auth redirection just like in main route/layout.svelte
	$effect(() => {
	( async()=> {
		const { data: sessionData, error } = await supabase.auth.getSession();
		// console.log(sessionData && data.user)
		//@ts-ignore
		if(sessionData && data.user ){
			//@ts-ignore
			authenticate(data.user)
	
				goto("/explore")
			
		}else{
			// goto("/auth")
		}

	})()
  })

	
// 	function isLoggedIn(): boolean {
// 		// if (!browser) {
// 		// 	return false;
// 		// }

// 		const userId = sessionStorage.getItem("user");
// 		if (userId && userId?.length > 1) {
// 			return true;
// 		}
// 		return false;
// 	}

// 	function redirectOnLogin() {
// 		console.count("to /explore");
// 		goto("/explore");
// 	}
// 	$effect(() => {
// 		if (isLoggedIn()) {
// 			console.count("Already logged in");
// 			redirectOnLogin();
// 		}
//   })



	// Array of image sources to cycle through

	// Function to fetch the image or get it from cache
	const getImage = async (cid: string) => {
		imageUrl = PUBLIC_LIGHTHOUSE_GATE_WAY + cid + "?h=300&w=300";
	};

	// Function to start the image rotation
	const startImageRotation = () => {
		if (intervalId) return; // Prevent multiple intervals

		intervalId = window.setInterval(() => {
			// Start fading out
			setTimeout(() => {
				currentIndex = (currentIndex + 1) % imageSources.length;
				const nextCid = imageSources[currentIndex].ipfsImages[0].hash;
				getImage(nextCid); // Fetch the new image
				// Fade in the new image
			}, 300); // 300ms delay for smooth transition
		}, 4000); // Change image every 4 seconds
	};

	async function signInWithGoogle() {
		let redirectToUrl = getRedirectURL()  + "/auth"
		// redirectToUrl = new URL("explore", redirectToUrl).toString()
		console.log("redirect to:", redirectToUrl)
		redirectToUrl = encodeURI(redirectToUrl)
		
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				//redirect url
				redirectTo: redirectToUrl,
				// skipBrowserRedirect: true,
				queryParams: {
					// redirect_uri: redirectToUrl,
				},
			}
		});

		if (error) {
			console.error("Error signing in with google:", error.message);
		}
	}
	async function signInWithApple() {
		let redirectToUrl = getRedirectURL()  + "/auth"
		// redirectToUrl = new URL("explore", redirectToUrl).toString()
		console.log("redirect to:", redirectToUrl)
		redirectToUrl = encodeURI(redirectToUrl)
		
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "apple",
			options: {
				//redirect url
				redirectTo: redirectToUrl,
				// skipBrowserRedirect: true,
				queryParams: {
					// redirect_uri: redirectToUrl,
				},
			}
		});

		if (error) {
			console.error("Error signing in with google:", error.message);
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
			getImage(
				imageSources[currentIndex]?.ipfsImages[0]?.hash +
					"/" +
					imageSources[currentIndex]?.ipfsImages[0]?.fileNames[0]
			); // Load the first image
			startImageRotation(); // Start rotating images
		}

		return stopImageRotation; // Cleanup on component unmount
	});
</script>

<main class="flex h-screen w-screen flex-col ">
	<div class="h-[8%] w-full py-2 px-5">

		<img src="/darkLogo.png" alt="unreal-art logo" class="flex dark:hidden h-full" />
		<img src="/whiteLogo.png" alt="unreal-art logo" class="hidden dark:flex h-full" />
	</div>
	<div class="h-[92%] w-full flex items-center justify-center">

<div class="flex h-full max-h-2/4  w-[90%] max-w-[800px] flex-col gap-3  py-3">


		<!-- <enhanced:img src={img} alt="landing page image  " /> -->
		<div class="flex h-[90%] w-full flex-col gap-2 lg:flex-row justify-center items-center pt-8">
			<div class="flex h-full max-h-[400px] w-full items-center justify-center lg:w-[50%]">
				{#if !imageUrl}
					<div class="flex h-full w-full items-center justify-center ">
  <div class="h-6 w-6 animate-spin rounded-full border-4 border-t-transparent border-primary"></div>
</div>

				{:else}
					<img
						src={imageUrl ? imageUrl : "/assets/ima1.jpg"}
						alt="home page"
						onerror={handleImageError}
						class={` rounded-md object-cover transition-opacity duration-300 ease-in-out`}
					/>
				{/if}
			</div>

			<div
				class="flex h-full w-full flex-col items-center justify-center gap-3 text-center lg:w-[50%]"
			>
				<p class="text-md text-center font-semibold">Get started</p>
				
				<button
					onclick={signInWithGoogle}
					class="  font-semibold flex h-12 w-full items-center justify-center gap-2 rounded-full border text-center hover:bg-secondary "
				>
					<Icon
						src={AiOutlineGooglePlus}
						size="28"
						viewBox="0 0 1024 1024"
						className="custom-icon"
						title="Custom icon params"
					></Icon>Google</button
				>
				<button
					onclick={signInWithApple}
					class="  font-semibold flex h-12 w-full items-center justify-center gap-3 rounded-full border text-center hover:bg-secondary "
				>
					<Icon
						src={AiOutlineApple}
						size="28"
						viewBox="0 0 1024 1024"
						className="custom-icon"
						title="Custom icon params"
					></Icon>Apple</button
				>
				
			</div>
		</div>
	</div>
	</div>
	
</main>
