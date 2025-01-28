<script lang="ts">
	import { Moon, Sun, } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import PromptForm from './PromptForm.svelte';
	import { derived } from 'svelte/store';

	import { toggleMode } from 'mode-watcher';
	// import { appkitStore,   } from "../appkitStore";
	import TopUp from './TopUp.svelte';
	import { getChainId, switchChain ,getAccount} from '@wagmi/core'
	import { account } from '$lib/web3modal';

	let isConnected = $state(false)



</script>

<section class="hidden h-[8%] w-full items-center justify-between gap-10 bg-stone-50 dark:bg-black/55 px-3 lg:flex">
	<div class="flex h-full w-[80%] items-center justify-center">
		<PromptForm section={'header'} />
	</div>
	<div class="[w-20%] flex h-full items-center justify-end gap-2">
		<Button onclick={toggleMode} variant="outline" class="h-10 w-12" size="icon">
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  <span class="sr-only">Toggle theme</span>
</Button>
	{#if $account.isConnected}
		<TopUp  />
	{/if}
		

		<!-- <appkit-button /> -->
		 <w3m-button class="" />

	</div>
</section>
