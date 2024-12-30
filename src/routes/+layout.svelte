<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { page } from '$app/stores';
	import SideBar from '@/components/SideBar.svelte';

	import Header from '@/components/Header.svelte';
	import MobileSideBar from '@/components/MobileSideBar.svelte';

	import Button from '@/components/ui/button/button.svelte';
	import { MoveLeft } from 'lucide-svelte';
	import { store } from '$lib/store';

	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { goto } from '$app/navigation';
	import { quickStore } from '@/quickStore';
	  import { ModeWatcher } from "mode-watcher";

	function goBack() {
		window.history.back();
	}


	$effect(() => {
		if (!$store.isAuthenticated) goto("/");
	});

</script>

<Toaster />
<ModeWatcher />

{#if $page.url.pathname === '/'}
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
							class="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"
						></div>
						<!-- Loading Text -->
						<p class="text-lg font-light text-gray-700">Generating files</p>
					</div>
				</div>
			{/if}
			<MobileSideBar />
		</div>
	</main>
{/if}
