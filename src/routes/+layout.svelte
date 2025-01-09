<script lang="ts">
	import '../app.css';
	
	import { page } from '$app/stores';
	import SideBar from '@/components/SideBar.svelte';

	import Header from '@/components/Header.svelte';
	import MobileSideBar from '@/components/MobileSideBar.svelte';

	import Button from '@/components/ui/button/button.svelte';
	import { MoveLeft } from 'lucide-svelte';

	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { quickStore } from '@/quickStore';
	  import { ModeWatcher } from "mode-watcher";
	import NProgress from 'nprogress';
  import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
  import 'nprogress/nprogress.css';


	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	import { toBool } from "$utils/bool.js";
	import { PUBLIC_DEV_SW } from '$env/static/public';
	import type { PageData } from './$types';
	import { supabase } from '@src/supabaseClient';
	import { authenticate } from '@/api';


	
	let { children ,data} = $props();


  onMount(() => {
    if ('serviceWorker' in navigator) {
			let enableSW = dev ? toBool(PUBLIC_DEV_SW) : true

			if (enableSW) {
				console.log("mounting service worker")
				navigator.serviceWorker.register('/service-worker.js', {
					type: dev ? 'module' : 'classic'
				});
			}
    }
  })


	function goBack() {
		window.history.back();
	}


	// Start NProgress when navigation begins
  beforeNavigate(() => {
    NProgress.start();
  });

  // Finish NProgress when navigation ends
  afterNavigate(() => {
    NProgress.done();
  });

  //handle auth redirection client side
  $effect(() => {
	( async()=> {
		const { data: sessionData, error } = await supabase.auth.getSession();
		//@ts-ignore
		if(sessionData && data.user ){
			//@ts-ignore
			authenticate(data.user)
			if($page.url.pathname == "/" || $page.url.pathname == "/auth"){
				goto("/explore")
			}else{
				goto($page.url.pathname)
			}
		}else{
			goto("/auth")
		}

	})()
  })


	

</script>

<Toaster />
<ModeWatcher />

{#if $page.url.pathname === '/' || $page.url.pathname === "/auth"}
	{@render children()}
{:else}
	<main class="relative flex h-screen w-screen">
		<SideBar />
		<div class="relative h-full w-full flex-grow">
			<Header />
			<section class="relative h-full w-full overflow-auto bg-stone-50 dark:bg-black/55 lg:h-[92%]">
				<Button
					onclick={goBack}
					class={`${$page.url.pathname.startsWith('/details') ? 'flex' : 'hidden'} absolute left-8 top-8 z-50 h-12 bg-black/20 dark:bg-black/70  text-white hover:bg-black/40`}
				>
					<MoveLeft size="25" />
				</Button>
				{@render children()}
			</section>
			{#if $quickStore.isGeneratingFiles}
				<div
					class="fixed bottom-20 right-0 flex items-center justify-center bg-gray-100 p-2 lg:bottom-0"
				>
					<div class="flex items-center space-x-4">
						<!-- Spinner -->
						<div
							class="h-6 w-6 animate-spin rounded-full border-4 border-black border-t-transparent"
						></div>
						<!-- Loading Text -->
						<p class="text-lg font-light text-gray-700">Generating files</p>
					</div>
				</div>
			{/if}
		</div>
		<MobileSideBar />
	</main>
{/if}
