<script lang="ts">
	import TopUp from './TopUp.svelte';
	import { Bell, House, Menu, Plus, GalleryVertical, Telescope, Sun, Moon } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import profileImage from '$lib/assets/ima1.jpg';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Zap } from 'lucide-svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Icon } from 'svelte-icons-pack';
	import { RiLogosTwitterXFill } from 'svelte-icons-pack/ri';
	import { RiDocumentContractLine } from 'svelte-icons-pack/ri';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Settings from 'lucide-svelte/icons/settings';
	import User from 'lucide-svelte/icons/user';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { BsBell } from 'svelte-icons-pack/bs';
	import { CiLinkedin } from "svelte-icons-pack/ci";

	import Textarea from './ui/textarea/textarea.svelte';
	import { createNewPost, fetchProfilePosts, generateImage, logoutUser } from '@/api';
	import { store } from '$lib/store';
	import type { DartsJobData, JobSpec, Output, Post } from '@/types';
	import { v4 as uuidv4 } from 'uuid';
	import type { UploadResponse } from 'pinata';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import random from 'random';
	import { toggleMode } from 'mode-watcher';
	import { quickStore } from '$lib/quickStore';
	import { appkitStore } from "../appkitStore";
	import { TrOutlineBrandTelegram } from 'svelte-icons-pack/tr';
  
	 import { readContract } from '@wagmi/core'
 import erc20Abi from "$lib/abi/erc20.json"
  import{PUBLIC_DART_ADDRESS, PUBLIC_ODP_ADDRESS} from "$env/static/public"
	import { formatEther } from "ethers6";
	let odpBalance = $state<number | null>(null)
 	let dartCreditBalance = $state<number | null>(null)


	let text = $state('');
	let prompt = $derived(text.trim());

	let open = $state(false);
	let isConnected = $state(false)

const onclick = async () => {
		open=false

		quickStore.updateLoader(true);
		//@ts-ignore
		const dto: JobSpec = {
			module: 'isdxl',
			version: 'v1.6.0',
			inputs: {
				Prompt: prompt,
				cpu: 30,
				ram: "24gb",
				Device: 'xpu',
				Seed: random.int(1e3, 1e8),
				N: 1,
				Format: "webp",
			},
			author: $store.user?.id as string,
			isPrivate: false,
			isPinned: false,
			category: 'GENERATION',
			
			
		};
		
		const data: Output | undefined = await generateImage(dto);
		//store the post
		// const post: Partial<Post> = {
		// 	author: $store.user?.id as string,
		// 	isPrivate: false,
		// 	prompt: text,
		// 	isPinned: false,
		// 	category: 'GENERATION',
		// 	//@ts-ignore FIX: typescript error
		// 	ipfsImages: data?.uploadResponse as UploadResponse[],
		// 	cpu: dto.inputs?.cpu as number,
		// 	device: dto.inputs?.Device as string,
		// 	seed: dto.inputs?.Seed as number
		// };


		if (!data) {
			toast.error('Error', {
				description: 'File generation failed'
				// action: {
				// 	label: 'Undo',
				// 	onClick: () => console.info('Undo')
				// }
			});
			quickStore.updateLoader(false);
		} else {
			// createNewPost(post as Post);
			quickStore.updateLoader(false);
			text = '';
			//force page load from server
			window.location.href = `/profile/${$store.user?.id}`
		}
	};

	const handleLogOut = () => {
		logoutUser()
	}




	
	$effect(() => {
	 setInterval(() => {
      // Access the store reactively
     isConnected =  $appkitStore.modal.getIsConnectedState()
    }, 1000);
	})



$effect(() => {
  const intervalId = setInterval(async () => {
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

<section class="fixed bottom-0 flex justify-center items-center gap-2  inset-x-0 h-16 w-full bg-stone-50 lg:hidden dark:bg-black">
	
	
	<div class="h-full w-[20%]   flex items-center justify-center">
			<Button onclick={()=>goto("/explore")} class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent">
				<Telescope size={22} />
			</Button>
	</div>
	<div class="h-full w-[20%]  flex items-center justify-center">
		<Button onclick={()=>goto("/creations")} class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent">
				<GalleryVertical size={20} class="" />
			</Button>
	</div>
	<div class="h-full w-[20%]  flex items-center justify-center">
	{#if dartCreditBalance && dartCreditBalance < 10}
		<Drawer.Root bind:open>

			<Drawer.Trigger class="border-none flex justify-center bg-primary text-white items-center outline-none focus:ring-0 hover:ring-0 focus-visible:ring-0 visited:ring-0 h-12 w-12 rounded-full  p-0 dark:bg-secondary dark:text-white">
				
					<Plus size={30} />
				
				</Drawer.Trigger
			>
			<Drawer.Content class="fixed inset-0 overflow-y-auto">

				<div class="mx-auto w-full max-w-sm">
					<Drawer.Header>
						<Drawer.Title>Generate Media</Drawer.Title>
						<Drawer.Description>Unleash your creative juice.</Drawer.Description>
					</Drawer.Header>
					<Textarea
						placeholder="Describe what you want to see"
						rows={10}
						class="ring-0"
						bind:value={text}
						
					/>
<!-- 
					<textarea placeholder="Describe what you want to see"
						rows={10}
						class="ring-0 w-full p-2 outline-none"
						bind:value={text}
						>
					</textarea> -->

					<Drawer.Footer>
					
						<Button disabled={$quickStore.isGeneratingFiles} {onclick}>Generate</Button>
						
						<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	{:else}
				<TopUp isFooter={true}/>
	{/if}
	</div>
	<div class="h-full w-[20%]   flex items-center justify-center">
		
			<Sheet.Root>
				<Sheet.Trigger
					class={ 
						` bg-red relative h-full w-full text-lg ring-transparent hover:bg-transparent focus:outline-none  outline-none focus:ring-0 hover:ring-0 focus-visible:ring-0 visited:ring-0 `}
				>
					<div class="relative flex h-full w-full items-center justify-center">
						<Bell size={16} />
						<Badge variant="destructive" class="absolute right-0 top-2  rounded-full">0</Badge>
					</div>
				</Sheet.Trigger>
				<Sheet.Content side="bottom">
					<Sheet.Header>
						<Sheet.Title>Notifications</Sheet.Title>
						<Sheet.Description>
							It looks like we do not have anything for you now.
						</Sheet.Description>
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		
	</div>
	<!-- <Menu size={20} /> -->
	<div class="h-full w-[20%]  flex items-center justify-center">
		<!-- <Button class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent outline-none focus:ring-0 hover:ring-0 focus-visible:ring-0 visited:ring-0"> -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class={ ` hover:bg-transparent outline-none focus:ring-0 hover:ring-0 focus-visible:ring-0 visited:ring-0`}
					><Menu size={20}></Menu></DropdownMenu.Trigger
				>
				<DropdownMenu.Content class=" mb-5 w-[300px]">
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
									<Zap size={15} /> <span>{dartCreditBalance} </span>
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
					</DropdownMenu.Item>
				</a>
						<a href="https://www.linkedin.com/company/decenter-ai/" target="_blank"><DropdownMenu.Item>
						<Icon src={CiLinkedin} className="mr-2 size-4" />
						<span>Linkedin</span>
					</DropdownMenu.Item></a>
						
						<!-- <DropdownMenu.Item>
							<Icon src={RiDocumentContractLine} className="mr-2 size-4" />
							<span>Terms & Privacy</span>
						</DropdownMenu.Item> -->
						<DropdownMenu.Item>
								
									<appkit-button />
							</DropdownMenu.Item>
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
						<DropdownMenu.Item  onclick={handleLogOut}>
							<LogOut class="mr-2 size-4"></LogOut>
							<span>Log out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		<!-- </Button> -->
	
	</div>

</section>
