<script>
	import { Zap } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import PromptForm from './PromptForm.svelte';
	import { toast } from 'svelte-sonner';

	const showNotice = () => {
		toast('✨ Full Access Unlocked!', {
			description:
				"Enjoy complimentary access to all features during our test phase! 🚀 Don't miss out on this exclusive opportunity."
		});
	};
</script>

<section class="hidden h-[8%] w-full items-center justify-between gap-10 bg-stone-50 px-3 lg:flex">
	<div class="flex h-full w-[80%] items-center justify-center">
		<PromptForm section={'header'} />
	</div>
	<div class="[w-20%] flex h-full items-center justify-end">
		<Button
			onclick={showNotice}
			class="flex h-12 space-x-2 bg-red-200 text-red-600 hover:bg-red-700 hover:text-white"
			><Zap size={20} /> <span>Upgrade</span>
		</Button>
	</div>
</section>
