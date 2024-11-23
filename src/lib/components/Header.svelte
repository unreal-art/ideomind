<script>
	import { Zap } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
</script>

<section class="flex h-[8%] w-full items-center justify-end bg-stone-50 px-3">
	<Button class="flex h-12 space-x-2 bg-red-200 text-red-600 hover:bg-red-700 hover:text-white"
		><Zap size={20} /> <span>Upgrade</span>
	</Button>
</section>
