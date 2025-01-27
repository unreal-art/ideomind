<script lang="ts">
	import { Moon, Sun, } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	import PromptForm from './PromptForm.svelte';
	import { derived } from 'svelte/store';

	import { toggleMode } from 'mode-watcher';
	import { appkitStore,   } from "../appkitStore";
	import TopUp from './TopUp.svelte';
	import { getChainId, switchChain ,getAccount} from '@wagmi/core'
	let isConnected = $state(false)


	// async function changeChain() {
	// 	const account = getAccount($appkitStore.wagmiAdapter.wagmiConfig);

	// 	// Handle WalletConnect or unsupported wallets
	// 	if (account.connector?.id === "walletConnect") {
	// 		alert("Please switch to the Torus Testnet manually in your WalletConnect-compatible wallet.");
	// 		return;
	// 	}

	// 	if (!window.ethereum) {
	// 		alert("No Ethereum provider detected. Please add the network manually.");
	// 		return;
	// 	}

	// 	try {
	// 		// Try switching the chain
	// 		await switchChain($appkitStore.wagmiAdapter.wagmiConfig, { chainId: 8194 });
	// 	} catch (error) {
	// 		console.warn("Switch failed, trying to add chain...", error);

	// 		try {
	// 			// Cast window.ethereum to any to avoid TypeScript error
	// 			await (window.ethereum as any).request({
	// 				method: "wallet_addEthereumChain",
	// 				params: [
	// 					{
	// 						chainId: "0x2002", // Hex equivalent of 8194
	// 						chainName: "Torus Testnet",
	// 						nativeCurrency: {
	// 							name: "Torus Ether",
	// 							symbol: "TTQF",
	// 							decimals: 18,
	// 						},
	// 						rpcUrls: ["https://rpc.testnet.toruschain.com"],
	// 						blockExplorerUrls: ["https://testnet.toruscan.com"],
	// 					},
	// 				],
	// 			});
	// 		} catch (addError) {
	// 			console.error("Failed to add network:", addError);
	// 			alert("Please manually add Torus Testnet in your wallet.");
	// 		}
	// 	}
	// }



	
	$effect(() => {
	 setInterval(() => {
      // Access the store reactively
     isConnected =  $appkitStore.modal.getIsConnectedState()

	// const chainId = getChainId($appkitStore.wagmiAdapter.wagmiConfig)
	// if(chainId  !== 8194){
	// 	changeChain()
	// }

    }, 1000);
	})

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
	{#if isConnected}
		<TopUp  />
	{/if}
		

		<appkit-button />

	</div>
</section>
