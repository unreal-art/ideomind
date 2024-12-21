<script lang="ts">
	import type { FollowStats } from "$lib/types";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Tabs from "$lib/components/ui/tabs";
	import image1 from "$lib/assets/ima1.jpg";
	import { Search, X, CalendarRange, MapPinHouse } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import Textarea from "@/components/ui/textarea/textarea.svelte";
	import { store } from "$lib/store";
	import {
		getUser,
		updateUserDetails,
		getUserLikedPosts,
		getUserPosts,
		getLikesReceivedByUser,
		getFollowStats
	} from "@/api";
	import UserPostList from "@/components/profile/UserPostList.svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import type { Post } from "@/types";

	let showInput: boolean = $state(false);
	let inputRef: HTMLDivElement | null = $state(null);
	let buttonRef: HTMLDivElement | null = $state(null);

	let isFixed: boolean = $state(false);
	let targetPosition: number = $state(0);
	let targetElement: HTMLElement | null = $state(null);
	let scrollContainer: HTMLElement | null = $state(null);

	let params = $state($page.params);


	let name = $state($store.user?.name);
	let username = $state($store.user?.name);
	let bio = $state($store.user?.bio);
	let location = $state($store.user?.location);
	let open = $state(false);
	let likedPosts = $state<Post[]>([]);
	let pinnedPosts = $state<Post[]>([]);
	let privatePosts = $state<Post[]>([]);
	let publicPosts = $state<Post[]>([]);
	let likesReceived = $state(0);
	let followStats = $state<FollowStats>({} as FollowStats);
	let updating = $state(false)
	
	$effect(() => {
		if (!$store.isAuthenticated) goto("/");
	});

	// Toggle input visibility
	const toggleInput = (): void => {
		showInput = true;
	};

	// Handle clicks outside the input
	const handleClickOutside = (event: MouseEvent): void => {
		const target = event.target as Node;

		if (inputRef && buttonRef) {
			// Check if the click was outside both the button and the input field
			if (!inputRef.contains(target) && !buttonRef.contains(target)) {
				showInput = false;
			}
		}
	};
	function handleScroll(): void {
		if (!scrollContainer) return;

		// Get the scroll position within the container
		const currentScroll = scrollContainer.scrollTop;

		// Toggle the fixed state based on the current scroll position
		isFixed = currentScroll >= targetPosition;
	}

	const getDate = (date: Date | undefined): string => {
		if (!date) return ""; // Handle null or undefined dates

		// Ensure `date` is a Date object
		const validDate = date instanceof Date ? date : new Date(date);
		// @ts-ignore
		if (isNaN(validDate)) return ""; // Handle invalid dates

		const month = validDate.toLocaleString("default", { month: "long" }); // Get full month name (e.g., 'December')
		const year = validDate.getFullYear(); // Get the year
		return `${month} ${year}`;
	};

	const updateProfile = async () => {
		updating = true
		const data = {
			name,
			// username,
			bio,
			location
		};
		//update detail
		$store.user?.id && await  updateUserDetails(data, $store.user?.id);
		open = false;
		updating=false
	};

	// Attach and clean up event listeners
	$effect(() => {
		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	});
	$effect(() => {
		if (targetElement && scrollContainer) {
			// Get the position of the target element relative to the scroll container
			const containerRect = scrollContainer.getBoundingClientRect();
			const targetRect = targetElement.getBoundingClientRect();
			targetPosition = targetRect.top - containerRect.top;
		}

		// Add a scroll listener to the container
		if (scrollContainer) {
			scrollContainer.addEventListener("scroll", handleScroll);
		}
		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener("scroll", handleScroll);
			}
		};
	});

	$effect(() => {
		likedPosts = getUserLikedPosts();
		pinnedPosts = $store.posts.filter((item) => item.isPinned);
		privatePosts = $store.posts.filter((item) => item.isPrivate);
		publicPosts = $store.posts.filter((item) => !item.isPrivate);
	});


	$effect(() => {
		const fetchLikesReceived = async () => {
			try {
				likesReceived = await getLikesReceivedByUser($store.user?.id);
			} catch (error) {
				console.error("Error fetching likes received:", error);
			}
		};
		const fetchFollowStat = async () => {
			try {
				followStats = await getFollowStats($store.user?.id);
			} catch (error) {
				console.error("Error fetching likes received:", error);
			}
		};
		fetchLikesReceived();
		fetchFollowStat();
	});
</script>

<section bind:this={scrollContainer} class="relative h-full w-full overflow-auto px-2">
	<div
		class=" m-auto flex min-h-[40vh] w-full max-w-[700px] justify-between gap-3 pt-10
		"
	>
		<div class="gap-6 lg:flex">
			<img src={$store.user?.image} alt="user profile" class="h-32 w-32 rounded-full" />
			<div class="flex flex-col gap-4 px-2 pt-4">
				<div class="">
					<p class="text-md font-semibold">{$store.user?.name}</p>
					<p class="text-sm font-extralight text-gray-500">{$store.user?.email}</p>
				</div>
				<div class="flex gap-6">
					<div class="">
						<p class="text-lg font-semibold">{followStats.followeeCount}</p>
						<p class="text-md font-extralight text-gray-500">
							follower{followStats.followeeCount > 1 ? "s" : ""}
						</p>
					</div>
					<div class="">
						<p class="text-lg font-semibold">{followStats.followerCount}</p>
						<p class="text-md font-extralight text-gray-500">
							following{followStats.followerCount > 1 ? "s" : ""}
						</p>
					</div>
					<div class="">
						<p class="text-lg font-semibold">{likesReceived}</p>
						<p class="text-md font-extralight text-gray-500">
							like{likesReceived > 1 ? "s" : ""} received
						</p>
					</div>
				</div>
				<div class="">
					<p class="text-md font-semibold">Bio</p>
					<p class="text-md prose font-extralight text-gray-500">{$store.user?.bio}</p>
				</div>
				<div class="flex gap-4">
					<div class="flex items-center gap-2 font-extralight text-gray-500">
						<CalendarRange size={20} />
						<p class="text-md prose whitespace-nowrap">Joined {getDate($store.user?.createdAt)}</p>
					</div>
					<div class="flex items-center gap-2 font-extralight text-gray-500">
						<MapPinHouse size={20} />
						<p class="text-md prose whitespace-nowrap">{$store.user?.location}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="flex h-full items-start">
			<Dialog.Root bind:open>
				<Dialog.Trigger
					class={buttonVariants({ variant: "outline" }) +
						` absolute right-2 mt-3 h-10 rounded-md bg-stone-50 text-sm font-extralight lg:relative lg:top-10`}
				>
					Edit Profile
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[500px]">
					<Dialog.Header>
						<Dialog.Title>Edit profile</Dialog.Title>
						<Dialog.Description>
							Make changes to your profile here. Click save when you're done.
						</Dialog.Description>
					</Dialog.Header>
					<form class="grid gap-4 py-4">
						<div class="items-center gap-4">
							<Label for="username" class="text-right">Name</Label>
							<Input id="username" bind:value={name} class="col-span-3"></Input>
						</div>
						<!-- <div class=" items-center gap-4">
							<Label for="name" class="text-right"
								>Name <span class="font-extralight">(Optional)</span></Label
							>
							<Input id="name" bind:value={name} class="col-span-3"></Input>
							<p class="w-full text-right text-xs font-extralight">(0/30)</p>
						</div> -->
						<div class=" items-center gap-4">
							<Label for="name" class="text-right"
								>Location <span class="font-extralight">(Optional)</span></Label
							>
							<Input id="name" bind:value={location} class="col-span-3"></Input>
							<p class="w-full text-right text-xs font-extralight">(0/30)</p>
						</div>
						<div class=" items-center gap-4">
							<Label for="name" class="text-right"
								>Bio <span class="font-extralight">(Optional)</span></Label
							>
							<Textarea bind:value={bio} />
							<p class="w-full text-right text-xs font-extralight">(0/150)</p>
						</div>
						<Dialog.Footer>
							<Button disabled={updating
							} onclick={updateProfile} type="button">Save changes</Button>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
	<div class=" relative min-h-[60vh]">
		<Tabs.Root value="public" class="relative h-full w-full">
			<div
				bind:this={targetElement}
				class={`${isFixed ? "fixed left-0 lg:top-16 " : " lg:relative"} top-0 z-20 flex h-12 w-full justify-center bg-stone-50 `}
			>
				<div
					class={`${showInput ? "block" : "hidden"} absolute left-0 top-0 z-20 h-full w-full max-w-[1000px] rounded-2xl border bg-stone-50`}
				>
					<div class="absolute right-0 top-0 flex h-full w-10 items-center justify-center">
						<Button variant="ghost" class="h-full hover:bg-transparent">
							<X size={20}></X>
						</Button>
					</div>
					<div class="h-full w-full" bind:this={inputRef}>
						<Input
							type="text"
							placeholder="Search prompt"
							class=" h-full w-full rounded-l-2xl  border-none bg-stone-50 pr-10 "
						></Input>
					</div>
				</div>
				<div class=" relative flex h-full w-full items-center justify-center space-x-1">
					<img
						src={image1}
						alt="user profile"
						class={`${isFixed ? "block" : "hidden"} absolute left-2 top-2 h-8 w-8 rounded-full lg:left-28`}
					/>
					<div class="flex h-full items-center" bind:this={buttonRef}>
						<Button onclick={toggleInput} variant="ghost" class="hidden h-full lg:block">
							<Search size={20}></Search>
						</Button>
					</div>
					<Tabs.List class="h-[5%] bg-transparent">
						<Tabs.Trigger value="pinned">Pinned</Tabs.Trigger>
						<Tabs.Trigger value="public">Public</Tabs.Trigger>
						<Tabs.Trigger value="private">Private</Tabs.Trigger>
						<Tabs.Trigger value="liked">Liked</Tabs.Trigger>
					</Tabs.List>
				</div>
			</div>

			<Tabs.Content value="pinned">
				<UserPostList data={pinnedPosts} />
			</Tabs.Content>
			<Tabs.Content value="public">
				<UserPostList data={publicPosts} />
			</Tabs.Content>
			<Tabs.Content value="private">
				<UserPostList data={privatePosts} />
			</Tabs.Content>

			<Tabs.Content value="liked" class="h-[95%] w-full  ">
				<UserPostList data={likedPosts} isLikes={true} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
