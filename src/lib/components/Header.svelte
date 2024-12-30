<script>
	import { Moon, Sun, Zap } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import PromptForm from './PromptForm.svelte';
	import { toast } from 'svelte-sonner';
	import { toggleMode } from 'mode-watcher';

	const showNotice = () => {
		toast('✨ Full Access Unlocked!', {
			description:
				"Enjoy complimentary access to all features during our test phase! 🚀 Don't miss out on this exclusive opportunity."
		});
	};
</script>

<section class="hidden h-[8%] w-full items-center justify-between gap-10 bg-stone-50 dark:bg-black/55 px-3 lg:flex">
	<div class="flex h-full w-[80%] items-center justify-center">
		<PromptForm section={'header'} />
	</div>
	<div class="[w-20%] flex h-full items-center justify-end gap-2">
		<Button onclick={toggleMode} variant="outline" class="h-12 w-12" size="icon">
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
		<Button
			onclick={showNotice}
			class="flex h-12 space-x-2 bg-red-200 text-red-600 hover:bg-red-700 hover:text-white"
			><Zap size={20} /> <span>Upgrade</span>
		</Button>
	</div>
</section>
