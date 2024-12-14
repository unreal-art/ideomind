<script lang="ts">
	import { Bell, House, Menu, Plus, GalleryVertical } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';

	import profileImage from '$lib/assets/ima1.jpg';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Zap } from 'lucide-svelte';

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
	import { store } from '$lib/store';
</script>

<section class="fixed bottom-0 h-20 w-full bg-stone-50 lg:hidden">
	<div
		class="before:absolute before:left-0 before:top-0 before:h-2 before:w-full before:bg-transparent before:shadow-md"
	></div>
	<div class="flex h-full w-full items-center justify-between px-4 pt-2">
		<Button class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent">
			<House size={20} />
		</Button>

		<Button class="relative w-10 bg-transparent text-primary shadow-none hover:bg-transparent">
			<GalleryVertical size={20} class="" />
		</Button>

		<Button class="h-12 w-12 rounded-full  p-0">
			<Plus size={30} />
		</Button>

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
							This action cannot be undone. This will permanently delete your account and remove
							your data from our servers.
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
									<img src={profileImage} alt="user profile" class="h-full rounded-full" />
									<div class="flex flex-col">
										<p class="text-sm">Codypharm</p>
										<p class="text-sm font-extralight text-gray-400">williamikeji@gmail.com</p>
									</div>
								</div>
							</div>
						</DropdownMenu.GroupHeading>
						<DropdownMenu.Separator></DropdownMenu.Separator>
						<div class="flex items-center justify-between px-3 py-3 text-sm">
							<p class=" font-semibold">Free</p>
							<div class="flex space-x-2">
								<div class="flex h-full items-center space-x-1 font-semibold">
									<Zap size={15} /> <span>0 / 10</span>
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
		</Button>
	</div>
</section>
