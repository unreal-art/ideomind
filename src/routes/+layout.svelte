<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import { page } from '$app/stores';
	import SideBar from '@/components/SideBar.svelte';

	import Header from '@/components/Header.svelte';
	import MobileSideBar from '@/components/MobileSideBar.svelte';

	import Button from '@/components/ui/button/button.svelte';
	import { MoveLeft } from 'lucide-svelte';

	function goBack() {
		window.history.back();
	}
</script>

{#if $page.url.pathname === '/'}
	{@render children()}
{:else}
	<main class="relative flex h-screen w-screen">
		<SideBar />
		<div class="h-full w-full flex-grow">
			<Header />
			<section class="relative h-full w-full overflow-auto bg-stone-50 lg:h-[92%]">
				<Button
					onclick={goBack}
					class={`${$page.url.pathname.startsWith('/details') ? 'flex' : 'hidden'} absolute left-8 top-8 z-50 h-12 bg-black/20 text-white hover:bg-black/40`}
				>
					<MoveLeft size="25" />
				</Button>
				{@render children()}
			</section>
		</div>

		<MobileSideBar />
	</main>
{/if}
