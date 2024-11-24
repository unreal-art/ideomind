<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { page } from '$app/stores';
	import SideBar from '@/components/SideBar.svelte';

	import Header from '@/components/Header.svelte';
</script>

{#if $page.url.pathname === '/'}
	{@render children()}
{:else}
	<main class="flex h-screen w-screen">
		<SideBar />
		<div class="h-full w-full flex-grow">
			<Header />
			<section class="bg- h-[92%] w-full overflow-auto bg-stone-50">
				{@render children()}
			</section>
		</div>
	</main>
{/if}
