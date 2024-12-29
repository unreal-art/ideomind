<script lang="ts">
	import { Bell, House, Menu, Plus, GalleryVertical, Telescope } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import profileImage from '$lib/assets/ima1.jpg';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Zap } from 'lucide-svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Icon } from 'svelte-icons-pack';
	import { RiLogosTwitterXFill } from 'svelte-icons-pack/ri';
	import { AiOutlineDiscord } from 'svelte-icons-pack/ai';
	import { RiDocumentContractLine } from 'svelte-icons-pack/ri';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Settings from 'lucide-svelte/icons/settings';
	import User from 'lucide-svelte/icons/user';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { BsBell } from 'svelte-icons-pack/bs';

	import Textarea from './ui/textarea/textarea.svelte';
	import { createNewPost, fetchProfilePosts, generateImage, logoutUser, postsByFollowed } from '@/api';
	import { store } from '$lib/store';
	import type { DartsJobData, JobSpec, Output, Post } from '@/types';
	import { v4 as uuidv4 } from 'uuid';
	import type { UploadResponse } from 'pinata';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import random from 'random';

	let text = $state('');
	let prompt = $derived(text.trim());

	let open = $state(false);

	const onclick = async () => {

		store.updateLoader(true);
		const dto: JobSpec = {
			module: 'isdxl',
			version: 'v1.5.0',
			inputs: {
				Prompt: prompt,
				cpu: 22,
				Device: 'xpu',
				Seed: random.int(1e3, 1e9),
				N:1,
			}
		};
		const {data}: {data:Output | undefined} = await generateImage(dto);
		//store the post
		const post: Partial<Post> = {
			author: $store.user?.id as string,
			isPrivate: false,
			prompt: text,
			isPinned: false,
			category: 'GENERATION',
			ipfsImages: data?.uploadResponse as UploadResponse[],
			cpu: dto.inputs?.cpu as number,
			device: dto.inputs?.Device as string,

		};
		console.log(data)

		if (!data) {
			toast.error('Error', {
				description: 'File generation failed'
				// action: {
				// 	label: 'Undo',
				// 	onClick: () => console.info('Undo')
				// }
			});
			store.updateLoader(false);
		} else {
			createNewPost(post as Post);
			store.updateLoader(false);
			text = '';
			goto(`/profile/${$store.user?.id}`)
		}
	};

	const handleLogOut = () => {
		logoutUser()
	}

</script>

<section class="fixed bottom-0 h-20 w-full bg-stone-50 lg:hidden">
	<div
		class="before:absolute before:left-0 before:top-0 before:h-2 before:w-full before:bg-transparent before:shadow-md"
	></div>
	<div class="flex h-full w-full items-center justify-between px-4 pt-2">
		<a href="/explore">
			<Button class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent">
				<Telescope size={22} />
			</Button>
		</a>

		<a href="/creations">
			<Button class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent">
				<GalleryVertical size={20} class="" />
			</Button>
		</a>

		<Drawer.Root bind:open>
			<Drawer.Trigger>
				<Button class="h-12 w-12 rounded-full  p-0 ">
					<Plus size={30} />
				</Button></Drawer.Trigger
			>
			<Drawer.Content>
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

					<Drawer.Footer>
						<Button disabled={$store.isGeneratingFiles} {onclick}>Generate</Button>
						<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
					</Drawer.Footer>
				</div>
			</Drawer.Content>
		</Drawer.Root>

		<Button
			class="relative w-10 bg-transparent text-primary shadow-none ring-transparent hover:bg-transparent"
		>
			<Sheet.Root>
				<Sheet.Trigger
					class={buttonVariants({ variant: 'ghost' }) +
						` bg-red relative h-fit w-full text-lg ring-transparent hover:bg-transparent focus:outline-none focus:ring-0 `}
				>
					<div class="relative flex h-16 w-full items-center justify-center">
						<Bell size={30} />
						<Badge variant="destructive" class="absolute -right-8 top-1  rounded-full">0</Badge>
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
		</Button>
		<!-- <Menu size={20} /> -->

		<Button class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class={buttonVariants({ variant: 'ghost' }) + ` bg w-full hover:bg-transparent`}
					><Menu size={20}></Menu></DropdownMenu.Trigger
				>
				<DropdownMenu.Content class=" mb-5 w-[300px]">
					<DropdownMenu.Group>
						<DropdownMenu.GroupHeading class="mb-3 h-14">
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
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<div class="flex items-center justify-between px-3 py-3 text-sm">
							<p class=" font-semibold">Free</p>
							<div class="flex space-x-2">
								<div class="flex h-full items-center space-x-1 font-semibold">
									<Zap size={15} /> <span>{$store.user?.creditBalance} / 10</span>
								</div>
								<span class="font-extralight"> credits left</span>
							</div>
						</div>

						<Button class="my-3 w-full"><Zap size={15} /> Upgrade plan</Button>
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
						<DropdownMenu.Item>
							<Icon src={RiLogosTwitterXFill} className="mr-2 size-4" />
							<span>Xapp</span>
						</DropdownMenu.Item>

						<DropdownMenu.Item>
							<Icon src={AiOutlineDiscord} className="mr-2 size-4" />
							<span>Discord</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<LifeBuoy class="mr-2 size-4"></LifeBuoy>
							<span>Support</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Icon src={RiDocumentContractLine} className="mr-2 size-4" />
							<span>Terms & Privacy</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<DropdownMenu.Item  onclick={handleLogOut}>
							<LogOut class="mr-2 size-4"></LogOut>
							<span>Log out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Button>
	</div>
</section>
