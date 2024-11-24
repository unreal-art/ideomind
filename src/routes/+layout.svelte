<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { page } from '$app/stores';
	import SideBar from '@/components/SideBar.svelte';

	import Header from '@/components/Header.svelte';
	import MobileSideBar from '@/components/MobileSideBar.svelte';
</script>

{#if $page.url.pathname === '/'}
	{@render children()}
{:else}
	<main class="relative flex h-screen w-screen">
		<SideBar />
		<div class="h-full w-full flex-grow">
			<Header />
			<section class="h-full w-full overflow-auto bg-stone-50 lg:h-[92%]">
				{@render children()}
			</section>
		</div>

		<MobileSideBar />
	</main>
{/if}
