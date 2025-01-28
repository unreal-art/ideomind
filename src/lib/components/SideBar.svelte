<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { GalleryVertical, House, Menu, Moon, Sun, Telescope } from 'lucide-svelte';
	import profileImage from '$lib/assets/ima1.jpg';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Settings from 'lucide-svelte/icons/settings';
	import User from 'lucide-svelte/icons/user';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Zap } from 'lucide-svelte';
	import { BsBell } from 'svelte-icons-pack/bs';
	import { Icon } from 'svelte-icons-pack';
	import { RiLogosTwitterXFill } from 'svelte-icons-pack/ri';
	import { TrOutlineBrandTelegram } from "svelte-icons-pack/tr";
	import { RiDocumentContractLine } from 'svelte-icons-pack/ri';
	import Badge from './ui/badge/badge.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { store } from '$lib/store';
	import { page } from '$app/stores';
	import { logoutUser } from '@/api';
	import { toggleMode } from 'mode-watcher';
	// import { appkitStore } from "../appkitStore";
	import TopUp from './TopUp.svelte';
	import { CiLinkedin } from 'svelte-icons-pack/ci';
 import { readContract } from '@wagmi/core'
 import erc20Abi from "$lib/abi/erc20.json"
  import{PUBLIC_DART_ADDRESS, PUBLIC_ODP_ADDRESS, PUBLIC_EXCHANGE_ADDRESS} from "$env/static/public"
	import { formatEther, parseEther } from "ethers6";
	import { account, wagmiConfig } from '$lib/web3modal';

	let odpBalance = $state<number | null>(null)
 	let dartCreditBalance = $state<number | null>(null)
	let isConnected = $state(false)

	// $effect(() => {
	// 	async function getData() {
	// 		imageUrl = await getPostUserImage($store.user.id);
	// 	}
	// 	getData();
	// });

	const handleLogOut = () => {
		logoutUser()
	}

	// $effect(() => {
	//  setInterval(() => {
	// 	console.log($account.address)
    //   // Access the store reactively
    // //  isConnected =  $account.isConnected
    // }, 1000);
	// })


$effect(() => {
  const intervalId = setInterval(async () => {
	if(!$account.isConnected) {
		dartCreditBalance = 0
		odpBalance = 0
		return
	}
    try {
      // Get ODP balance of connected wallet address
      const data = await readContract(wagmiConfig, {
        address: PUBLIC_ODP_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [$account.address],
      });

      //@ts-ignore
      odpBalance = data ? Number(formatEther(data)) : 0;

      // Get Dart token balance of user backend wallet
      const dartData = await readContract(wagmiConfig, {
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

<aside class="z-50 hidden h-full w-[5%] min-w-[100px] border-r px-2 py-2 lg:block">
	<div class="flex h-[50%] w-full flex-col gap-4">
		<a href="/explore" >
			<div class="flex h-16 w-full items-center justify-center">
				<img src="/Icon-Black.png" alt="unreal-art logo" class="flex dark:hidden size-11" />
				<img src="/Icon-White.png" alt="unreal-art logo" class="hidden dark:flex size-11" />
			</div>
		</a>
		<a href="/explore">
			<Button
			variant="secondary"
				class={`mt-6 flex h-16 w-full flex-col justify-center gap-2 dark:text-gray-400 text-gray-600 ${$page.url.pathname.startsWith('/explore') ? 'bg-gray-300 dark:bg-gray-700 text-black' : ''} hover:bg-gray-300 hover:text-black hover:dark:bg-gray-700`}
				><Telescope size={20} />
				<span class="text-xs">Explore</span>
			</Button>
		</a>
		<a href="/creations">
			<Button
			variant="secondary"
				class={`flex h-16 w-full flex-col justify-center gap-2 dark:text-gray-400  text-gray-600 ${$page.url.pathname.startsWith('/creations') ? 'bg-gray-300 text-black dark:bg-gray-700' : ''} hover:bg-gray-300 hover:text-black hover:dark:bg-gray-700`}
				><GalleryVertical size={20} />
				<span class="text-xs">Creations</span>
			</Button>
		</a>
	</div>
	<div class="flex h-[50%] w-full flex-col justify-end gap-4">
		<Sheet.Root>
			<Sheet.Trigger
				class={buttonVariants({ variant: 'ghost' }) +
					` relative h-16 w-full text-lg ring-transparent hover:bg-transparent focus:outline-none focus:ring-0 `}
			>
				<div class="relative flex h-16 w-full items-center justify-center">
					<Icon src={BsBell} className=" " />
					<Badge variant="destructive" class="absolute -right-1 top-1  rounded-full">0</Badge>
				</div>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<Sheet.Header>
					<Sheet.Title>Notifications</Sheet.Title>
					<Sheet.Description>It looks like we do not have anything for you now.</Sheet.Description>
				</Sheet.Header>
			</Sheet.Content>
		</Sheet.Root>

		<a href={`/profile/${$store.user?.id}`}>
			<Button variant="ghost" class=" w-full hover:bg-transparent">
				<img src={$store.user?.image}  alt="user profile" class="h-12 w-12 rounded-full" />
			</Button></a
		>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class={buttonVariants({ variant: 'ghost' }) + ` w-full hover:bg-transparent`}
			>
				<div class="-mt-2 flex h-16 w-full items-center justify-center">
					<Menu size={20} />
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="ml-28 w-72">
				<DropdownMenu.Group>
					<a href={`/profile/${$store.user?.id}`} class="flex items-center h-14"><DropdownMenu.GroupHeading class="mb-3 h-full ">
						<div class="mt-3 flex h-full w-full items-center justify-between">
							<div class="flex h-full space-x-2">
								<img src={$store.user?.image}  alt="user profile" class="h-full rounded-full" />
								<div class="flex flex-col">
									<p class="text-sm">{$store.user?.name}</p>
									<p class="text-sm font-extralight text-gray-400">{$store.user?.email}</p>
								</div>
							</div>
						</div>
					</DropdownMenu.GroupHeading>
					</a>
					<DropdownMenu.Separator></DropdownMenu.Separator>
					<div class="flex items-center justify-between px-3 py-3 text-sm">
						
						<div class="flex space-x-2">
							<div class="flex h-full items-center space-x-1 font-semibold">
								<Zap size={15} /> <span>{dartCreditBalance}</span>
							</div>
							<span class="font-extralight"> credits left</span>
						</div>

						<p class=" font-semibold">Minimum: 10</p>
					</div>

					{#if isConnected}
							<TopUp isMobile={true} />
							
						{/if}
					<DropdownMenu.Group>
						<a href={`/profile/${$store.user?.id}`}>
							<DropdownMenu.Item>
								<User class="mr-2 size-4"></User>
								<span>Profile</span>
							</DropdownMenu.Item>
						</a>

						<DropdownMenu.Item>
							<CreditCard class="mr-2 size-4"></CreditCard>
							<span>Billing</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Settings class="mr-2 size-4"></Settings>
							<span>Settings</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>

					<DropdownMenu.Separator></DropdownMenu.Separator>
					<a href="https://twitter.com/decenteraicom?s=21&t=th7q1ztmiuaE2PoODm3k0A" target="_blank"><DropdownMenu.Item>
							<Icon src={RiLogosTwitterXFill} className="mr-2 size-4" />
							<span>Xapp</span>
						</DropdownMenu.Item></a>

					<a href="https://t.me/decenteraicomchat" target="_blank"><DropdownMenu.Item>
						<Icon src={TrOutlineBrandTelegram} className="mr-2 size-4" />
						<span>Telegram</span>
					</DropdownMenu.Item></a>

				
						<a href="https://www.linkedin.com/company/decenter-ai/" target="_blank"><DropdownMenu.Item>
						<Icon src={CiLinkedin} className="mr-2 size-4" />
						<span>Linkedin</span>
					</DropdownMenu.Item></a>
					
					<!-- <DropdownMenu.Item>
						<Icon src={RiDocumentContractLine} className="mr-2 size-4" />
						<span>Terms & Privacy</span>
					</DropdownMenu.Item> -->
					
								<DropdownMenu.Separator></DropdownMenu.Separator>
					<DropdownMenu.Item class="pl-1" onclick={toggleMode}>
							
							<Button  variant="outline" size="icon" class=" ">
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
</Button>
<span class="">Toggle theme</span>

						</DropdownMenu.Item>
					<DropdownMenu.Separator></DropdownMenu.Separator>
					<DropdownMenu.Item onclick={handleLogOut}>
						<LogOut class="mr-2 size-4"></LogOut>
						<span>Log out</span>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</aside>
