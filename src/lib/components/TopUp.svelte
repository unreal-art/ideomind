<script lang="ts">
 import {
  Button,
  buttonVariants
 } from "$lib/components/ui/button/index.js";
 import * as Dialog from "$lib/components/ui/dialog/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
 import { Label } from "$lib/components/ui/label/index.js";
 import { toast } from 'svelte-sonner';
 import { Zap } from 'lucide-svelte';
 import {store} from "$lib/store"
 import { readContract, writeContract } from '@wagmi/core'
 import erc20Abi from "$lib/abi/erc20.json"
  import{PUBLIC_DART_ADDRESS, PUBLIC_ODP_ADDRESS, PUBLIC_EXCHANGE_ADDRESS} from "$env/static/public"
	import { formatEther, parseEther } from "ethers6";
	import { appkitStore,  } from "@/appkitStore";
  import DartExchange from "$lib/abi/DartExchange.json"
	

 let {isMobile}:{isMobile ?: boolean } = $props() 
 let odpBalance = $state<number | null>(null)
 let dartCreditBalance = $state<number | null>(null)
  let amt = $state("")

let open = $state(false)
 	
	

 const onclick = async () => {
  if (!amt) return;  // Validate the amount

  try {
    // Approve the transfer
    const result = await writeContract($appkitStore.wagmiAdapter.wagmiConfig, {
      abi: erc20Abi,
      address: PUBLIC_ODP_ADDRESS,
      functionName: 'approve',
      args: [
        PUBLIC_EXCHANGE_ADDRESS,
        parseEther(amt.toString()),
      ],
    });

    // Call the swap function
    const swapResult = await writeContract($appkitStore.wagmiAdapter.wagmiConfig, {
      abi: DartExchange.abi,
      address: PUBLIC_EXCHANGE_ADDRESS,
      functionName: 'exchange',
      args: [
        parseEther(amt.toString()),
        $store.user?.wallet.address,
      ],
    });

    // Success toast
    toast('✨ Success!', {
      description: "Credit top-up completed successfully.",
    });

  } catch (error) {
    console.error(error);  // Log the error for debugging

    // Error toast
    toast('Error', {
      description: "An error occurred during top up.",
    });

  } finally {
    amt = "";  // Reset the amount
  }
};







$effect(() => {
  ( async()=> {

    //get odp balance of connected wallet address
    const data  = await readContract($appkitStore.wagmiAdapter.wagmiConfig,{
      address: PUBLIC_ODP_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args:[$appkitStore.modal.getAddress()]
    })

    //@ts-ignore
    odpBalance = data ? Number(formatEther(data)) : 0

    //get dart token balance of user backend wallet
    const dartData  = await readContract($appkitStore.wagmiAdapter.wagmiConfig,{
      address: PUBLIC_DART_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args:[$store.user?.wallet.address]
    })

    //@ts-ignore
    dartCreditBalance = dartData ? Number(formatEther(dartData)) : 0


    console.log(odpBalance, dartCreditBalance)
  })()
})


</script>
 
<Dialog.Root bind:open={open}>
 <Dialog.Trigger 
 class={`${isMobile ? "w-full" : ""} `}
  >
  {#if isMobile}
    <Button  class="my-3 w-full"><Zap size={15} /> Top up</Button>
  {:else}
    <Button
			
			class="flex h-10 w-full space-x-2 bg-red-200 text-red-600 hover:bg-red-700 hover:text-white"
			><Zap size={20} /> <span>Top up</span>
		</Button>
  {/if}
  
  </Dialog.Trigger
 >
 <Dialog.Content class="sm:max-w-[425px]">
  <Dialog.Header>
   <Dialog.Title>
    Top up
   </Dialog.Title>
   <Dialog.Description>
    Add to your current credit count.
   </Dialog.Description>
  </Dialog.Header>

   <div class=" items-center gap-4">
    <Label for="name" class="text-right">Amount</Label>
    <Input id="name" type="number" bind:value={amt} min={0.0000001} placeholder="0.0"  />
   </div>
  

  <Dialog.Footer>
   <Button {onclick}  type="submit">Add</Button>
  </Dialog.Footer>
 </Dialog.Content>
</Dialog.Root>