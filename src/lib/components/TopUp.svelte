<script lang="ts">
 import {
  Button,
  buttonVariants
 } from "$lib/components/ui/button/index.js";
 import * as Dialog from "$lib/components/ui/dialog/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
 import { Label } from "$lib/components/ui/label/index.js";
 import { toast } from 'svelte-sonner';
 import { Plus, Zap } from 'lucide-svelte';
 import {store} from "$lib/store"
 import { readContract, writeContract } from '@wagmi/core'
 import erc20Abi from "$lib/abi/erc20.json"
  import{PUBLIC_DART_ADDRESS, PUBLIC_ODP_ADDRESS, PUBLIC_EXCHANGE_ADDRESS} from "$env/static/public"
	import { formatEther, parseEther } from "ethers6";
	import { appkitStore,  } from "@/appkitStore";
  import DartExchange from "$lib/abi/DartExchange.json"
	

 let {isMobile, isFooter}:{isMobile ?: boolean , isFooter?:boolean} = $props() 
 let odpBalance = $state<number | null>(null)
 let dartCreditBalance = $state<number | null>(null)
 let odpPerDart = $state<number | null>(null)
 let matchingOdpAmount = $state<number | null>(null)
  let amt = $state("")
  let topping = $state(false)

 let topUpOpen = $state(false)
 	let isConnected = $state(false)

	

 const onclick = async () => {
  if (!matchingOdpAmount) return;  // Validate the amount

  try {
    topping=true
    // Approve the transfer
    const result = await writeContract($appkitStore.wagmiAdapter.wagmiConfig, {
      abi: erc20Abi,
      address: PUBLIC_ODP_ADDRESS,
      functionName: 'approve',
      args: [
        PUBLIC_EXCHANGE_ADDRESS,
        parseEther(matchingOdpAmount?.toString() ),
      ],
    });

    // Call the swap function
    const swapResult = await writeContract($appkitStore.wagmiAdapter.wagmiConfig, {
      abi: DartExchange.abi,
      address: PUBLIC_EXCHANGE_ADDRESS,
      functionName: 'exchange',
      args: [
        parseEther(matchingOdpAmount.toString()),
        $store.user?.wallet.address,
      ],
    });

    // Success toast
    toast('✨ Success!', {
      description: "Credit top-up completed successfully.",
    });

  } catch (error) {
    console.error(error);  // Log the error for debugging
    topping = false
    // Error toast
    toast('Error', {
      description: "An error occurred during top up.",
    });

  } finally {
    amt = "";  // Reset the amount
    topping = false
    topUpOpen = false
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

    //get exchange rate
    const dartExchngeRate  = await readContract($appkitStore.wagmiAdapter.wagmiConfig,{
      address: PUBLIC_EXCHANGE_ADDRESS,
      abi: DartExchange.abi,
      functionName: 'rate',
     
    })

    //@ts-ignore
    odpPerDart = dartExchngeRate ? Number(formatEther(dartExchngeRate)) : 0

    // console.log(odpBalance, dartCreditBalance, odpPerDart)
  })()
})

const getExchange = async () => {
if(!isConnected) return
    //get exchange rate
    const dartExchngeRate  = await readContract($appkitStore.wagmiAdapter.wagmiConfig,{
      address: PUBLIC_EXCHANGE_ADDRESS,
      abi: DartExchange.abi,
      functionName: 'dartExchangeRate',
      args:[
        parseEther(amt.toString())
      ]
    })
    //@ts-ignore
    matchingOdpAmount = dartExchngeRate ? Number(formatEther(dartExchngeRate)) : 0

}

$effect(() => {
	 setInterval(() => {
      // Access the store reactively
     isConnected =  $appkitStore.modal.getIsConnectedState()
    }, 1000);
	})



$effect(() => {
  const intervalId = setInterval(async () => {
	if(!$appkitStore.modal.getIsConnectedState()) return
    try {
      // Get ODP balance of connected wallet address
      const data = await readContract($appkitStore.wagmiAdapter.wagmiConfig, {
        address: PUBLIC_ODP_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [$appkitStore.modal.getAddress()],
      });

      //@ts-ignore
      odpBalance = data ? Number(formatEther(data)) : 0;

      // Get Dart token balance of user backend wallet
      const dartData = await readContract($appkitStore.wagmiAdapter.wagmiConfig, {
        address: PUBLIC_DART_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [$store.user?.wallet.address],
      });

      //@ts-ignore
      dartCreditBalance = dartData ? Number(formatEther(dartData)) : 0;

      // Log the balances
    //   console.log(odpBalance, dartCreditBalance);

    } catch (error) {
      console.error("Error fetching balances:", error);
    }
  }, 1000); // 1000 ms 

  
});


</script>
 
<Dialog.Root bind:open={topUpOpen}>
 <Dialog.Trigger 
 class={`${isMobile ? "w-full" : ""} focus-visible:ring-0 outline-none border-none focus:ring-0 `}
  >
  {#if isMobile}
    <Button  class="my-3 w-full  bg-red-200 text-red-600 hover:bg-red-700 hover:text-white"><Zap size={15} /> Top up</Button>
  {:else if isFooter}
   <Button class="h-12 w-12 rounded-full  p-0 dark:bg-secondary dark:text-white">
					<Plus size={30} />
				</Button>

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
    A minimum of 10 credits is required to run your job.
   </Dialog.Description>
  </Dialog.Header>

   <div class=" items-center gap-4">
    <Label for="name" class="text-right">Credit amount</Label>
    <Input id="name" type="number" bind:value={amt} min={0.0000001} placeholder="0.0" oninput={getExchange}  />
    <div class="flex justify-between">
    <div class="flex space-x-2 items-center text-sm">
      <div class="flex h-full items-center space-x-1 font-semibold">
        <Zap size={15} />
        <span>{dartCreditBalance}</span>
      </div>
      <span class="font-extralight">credits left</span>
    </div>
    <p class="flex gap-2 justify-end pt-2 text-sm">
      <span>{matchingOdpAmount ? matchingOdpAmount : 0}</span>
      <span class="text-gray-500">ODP</span>
    </p>
  </div>

   </div>
  

  <Dialog.Footer>
    {#if isConnected}

      <Button {onclick} disabled={topping}  type="submit" class="w-full">Top up</Button>
    {:else}
    		<appkit-button />
	{/if}
  </Dialog.Footer>
 </Dialog.Content>
</Dialog.Root>