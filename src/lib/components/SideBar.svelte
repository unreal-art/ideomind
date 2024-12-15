<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { GalleryVertical, House, Menu, Telescope } from 'lucide-svelte';
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
	import { AiOutlineDiscord } from 'svelte-icons-pack/ai';
	import { RiDocumentContractLine } from 'svelte-icons-pack/ri';
	import Badge from './ui/badge/badge.svelte';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { store } from '$lib/store';
	import { page } from '$app/stores';
</script>

<aside class="z-50 hidden h-full w-[5%] min-w-[100px] border-r px-2 py-2 lg:block">
	<div class="flex h-[50%] w-full flex-col gap-4">
		<a href="/explore">
			<div class="flex h-16 w-full items-center justify-center">
				<img src="/vertical-black.png" alt="unreal-art logo" class="flex dark:hidden" />
				<img src="/vertical-white.png" alt="unreal-art logo" class="hidden dark:flex" />
			</div>
		</a>
		<a href="/explore">
			<Button
				class={`mt-6 flex h-16 w-full flex-col justify-center gap-2 bg-gray-200 text-gray-600 ${$page.url.pathname.startsWith('/explore') ? 'bg-gray-300 text-black' : ''} hover:bg-gray-300 hover:text-black`}
				><Telescope size={20} />
				<span class="text-xs">Explore</span>
			</Button>
		</a>
		<a href="/creations">
			<Button
				class={`mt-6 flex h-16 w-full flex-col justify-center gap-2 bg-gray-200 text-gray-600 ${$page.url.pathname.startsWith('/creations') ? 'bg-gray-300 text-black' : ''} hover:bg-gray-300 hover:text-black`}
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
				<img src={profileImage} alt="user profile" class="h-12 w-12 rounded-full" />
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
					<DropdownMenu.GroupHeading class="mb-3 h-14 ">
						<div class="mt-3 flex h-full w-full items-center justify-between">
							<div class="flex h-full space-x-2">
								<img src={profileImage} alt="user profile" class="h-full rounded-full" />
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
								<Zap size={15} /> <span>10 / 10</span>
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
					<DropdownMenu.Item>
						<LogOut class="mr-2 size-4"></LogOut>
						<span>Log out</span>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</aside>
