<script>
	import { Zap } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import { page } from '$app/stores';
</script>

<section class="hidden h-[8%] w-full items-center justify-between gap-10 bg-stone-50 px-3 lg:flex">
	<div class="flex h-full w-[80%] items-center justify-center">
		<form
			class={`${$page.url.pathname.startsWith('/details') ? 'flex' : 'hidden'} h-12 w-full max-w-6xl items-center`}
		>
			<Input
				type="text"
				placeholder="Describe what you want to see"
				class="h-full w-[60%] rounded-none rounded-l-2xl md:w-[80%]"
			/>
			<Button type="submit" class="h-full w-[40%] rounded-none rounded-r-2xl text-white md:w-[20%]"
				>Generate</Button
			>
		</form>
	</div>
	<div class="[w-20%] flex h-full items-center justify-end">
		<Button class="flex h-12 space-x-2 bg-red-200 text-red-600 hover:bg-red-700 hover:text-white"
			><Zap size={20} /> <span>Upgrade</span>
		</Button>
	</div>
</section>
