<script lang="ts">
	import type { FollowStats } from "$lib/types";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import * as Tabs from "$lib/components/ui/tabs";
	import image1 from "$lib/assets/ima1.jpg";
	import { Search, X, CalendarRange, MapPinHouse, User } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import Textarea from "@/components/ui/textarea/textarea.svelte";
	import { store } from "$lib/store";
	import type { PageData } from "./$types";
	
	import {
		getUser,
		updateUserDetails,
		getUserLikedPosts,
		getUserPosts,
		getLikesReceivedByUser,
		getFollowStats,
		fetchProfilePosts,

		fetchProfileData

	} from "@/api";
	import UserPostList from "@/components/profile/UserPostList.svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import type { Post } from "@/types";
	import { supabase } from "@src/supabaseClient";
	import SearchBox from "@/components/SearchBox.svelte";

	let { data }: { data: PageData } = $props();

	let showInput: boolean = $state(false);
	let inputRef: HTMLDivElement | null = $state(null);
	let buttonRef: HTMLDivElement | null = $state(null);

	let isFixed: boolean = $state(false);
	let targetPosition: number = $state(0);
	let targetElement: HTMLElement | null = $state(null);
	let scrollContainer: HTMLElement | null = $state(null);
	
	let currentUser = $state<User | null>(null)
	let name = $state("");
	let username = $state("");
	let bio = $state("");
	let location = $state("");
	let open = $state(false);
	let likedPosts = $state<Post[]>([]);
	let pinnedPosts = $state<Post[]>([]);
	let privatePosts = $state<Post[]>([]);
	let publicPosts = $state<Post[]>([]);
	let likesReceived = $state(0);
	let followStats = $state<FollowStats>({} as FollowStats);
	let updating = $state(false);
	let loading = $state(true);
	let posts = $state<Post[]>(data.posts as Post[]);
let loadingMore = $state(false);
let offset = $state(10);
let tab = $state("")

	$effect(() => {
		if (!$store.isAuthenticated) goto("/");
	});

	// Toggle input visibility
	const toggleInput = (): void => {
		showInput = true;
	};

async function loadMore() {
 

  if (tab !== 'liked') {
	 if (loadingMore || posts.length < 10) return;
  
  loadingMore = true;
    // Fetch posts from "posts" table where author matches the slug
    const { data: newPosts, error } = await supabase
      .from("posts")
      .select(`*`)
      .eq("author", $page.params.slug)
      .order("createdAt", { ascending: false })
      .range(offset, offset + 9); // Fetch the next 10 posts

    if (error) {
      loadingMore = false;
      console.error("Error loading more posts:", error);
      return;
    }

    if (newPosts?.length) {
      posts = [...posts, ...newPosts]; // Assuming your store has an `addPosts` method
      // console.log(posts);
      offset += 10; // Increment offset
    }
  } else {

	 if (loadingMore || likedPosts.length < 10) return;
  
  loadingMore = true;
    // Query the "likes" table and join it with the "posts" table
    const { data, error } = await supabase
      .from("likes") // Query the "likes" table
      .select(`
        posts(*), 
        created_at
      `) // Fetch all columns from "posts" and include "likes.created_at"
      .eq("author", $page.params.slug) // Filter by the user ID
      .order("created_at", { ascending: false }) // Order by "likes.created_at"
      .range(offset, offset + 9); // Pagination: fetch 10 records

    // Map through the data to extract the posts array
    const newPosts = data?.flatMap((like: { posts: Post[] }) => like.posts) || [];

    if (error) {
      loadingMore = false;
      console.error("Error loading more posts:", error);
      return;
    }

    if (newPosts?.length) {
      likedPosts = [...likedPosts, ...newPosts]; // Assuming your store has an `addPosts` method
      // console.log(posts);
      offset += 10; // Increment offset
    }
  }

  loadingMore = false;
}

	// Handle clicks outside the input
	// const handleClickOutside = (event: MouseEvent): void => {
	// 	const target = event.target as Node;

	// 	if (inputRef && buttonRef) {
	// 		// Check if the click was outside both the button and the input field
	// 		if (!inputRef.contains(target) && !buttonRef.contains(target)) {
	// 			showInput = false;
	// 		}
	// 	}
	// };
	function handleScroll(): void {
		
		if (!scrollContainer) return;
loadMore()
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
		updating = true;
		const data = {
			name,
			// username,
			bio,
			location
		};
		//update detail
		$store.user?.id && (await updateUserDetails(data, $store.user?.id));
		open = false;
		updating = false;
	};

	const reloadData = async (value: string) => {
		tab = value
		loading = true;
		const data = await fetchProfilePosts($page.params.slug, 0);
		posts = data.posts;
		loading = false;
	};

	const getLikedPosts = async () => {
		likedPosts = await getUserLikedPosts($page.params.slug, 0);
	};

	// Attach and clean up event listeners
	// $effect(() => {
	// 	document.addEventListener("click", handleClickOutside);

	// 	return () => {
	// 		document.removeEventListener("click", handleClickOutside);
	// 	};
	// });
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
		if (!data.posts) return;
		getLikedPosts();
		pinnedPosts = posts.filter((item) => item.isPinned);
		privatePosts = posts.filter((item) => item.isPrivate);
		publicPosts = posts.filter((item) => !item.isPrivate);
		loading = false;
	});

	$effect(() => {
		const fetchLikesReceived = async () => {
			try {
				likesReceived = await getLikesReceivedByUser($page.params.slug);
			} catch (error) {
				console.error("Error fetching likes received:", error);
			}
		};
		const fetchFollowStat = async () => {
			try {
				followStats = await getFollowStats($page.params.slug);
			} catch (error) {
				console.error("Error fetching likes received:", error);
			}
		};
		fetchLikesReceived();
		fetchFollowStat();
	});

	$effect(() => {
		(async () =>{
			const data = await fetchProfileData($page.params.slug)
			if(data) {
				currentUser = data[0]
				let name = $state(data[0].full_name);
				let username = $state(data[0].username);
				let bio = $state(data[0].bio);
				let location = $state(data[0].location);
			}
		})()
	})
</script>

<section bind:this={scrollContainer} class="relative h-full w-full overflow-auto px-2">
	<div
		class=" m-auto flex min-h-[40vh] w-full max-w-[700px] justify-between gap-3 pt-10
		"
	>
		<div class="gap-6 lg:flex">
			<img src={currentUser?.avatar_url} alt="user profile" class="h-32 w-32 rounded-full" />
			<div class="flex flex-col gap-4 px-2 pt-4">
				<div class="">
					<p class="text-md font-semibold">{currentUser?.full_name}</p>
					<p class="text-sm font-extralight text-gray-500">{currentUser?.email}</p>
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
					<p class="text-md prose font-extralight text-gray-500">{currentUser?.bio}</p>
				</div>
				<div class="flex gap-4">
					<div class="flex items-center gap-2 font-extralight text-gray-500">
						<CalendarRange size={20} />
						<p class="text-md prose whitespace-nowrap">Joined {getDate(currentUser?.createdAt)}</p>
					</div>
					<div class="flex items-center gap-2 font-extralight text-gray-500">
						<MapPinHouse size={20} />
						<p class="text-md prose whitespace-nowrap">{currentUser?.location}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="flex h-full items-start">
			{#if $page.params.slug == $store.user?.id}
			<Dialog.Root bind:open>
				<Dialog.Trigger
					class={buttonVariants({ variant: "outline" }) +
						` absolute right-2 mt-3 h-10 rounded-md  text-sm font-extralight lg:relative lg:top-10`}
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
							<Button disabled={updating} onclick={updateProfile} type="button">Save changes</Button
							>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
			{/if}
		</div>
	</div>
	<div class=" relative min-h-[60vh]">
		<Tabs.Root onValueChange={(value) => reloadData(value)} value="public" class="relative h-full w-full">
			<div
				bind:this={targetElement}
				class={`${isFixed ? "fixed left-0 lg:top-16 " : " lg:relative"} top-0 z-20 flex h-12 w-full justify-center bg-stone-50 dark:bg-secondary`}
			>
				<!-- <div
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
							class=" h-full w-full rounded-l-2xl  border-none bg-stone-50 dark:bg-black pr-10 "
						></Input>
					</div>
				</div> -->
				<div class=" relative flex h-full w-full items-center justify-center space-x-1">
					<div class="flex gap-1 pl-1">
						<img
						src={currentUser?.avatar_url} 
						alt="user profile"
						class={`${isFixed ? "block" : "hidden"}  left-2 top-2 h-8 w-8 rounded-full lg:left-28`}
					/>
					<div class="flex h-full items-center " >
						<SearchBox />
					</div>
					</div>
					<Tabs.List class="h-[5%] bg-transparent gap-2">
						<Tabs.Trigger value="pinned" class="dark:bg-black/55">Pinned</Tabs.Trigger>
						<Tabs.Trigger value="public" class="dark:bg-black/55">Public</Tabs.Trigger>
						<Tabs.Trigger value="private" class="dark:bg-black/55">Private</Tabs.Trigger>
						<Tabs.Trigger value="liked" class="dark:bg-black/55">Liked</Tabs.Trigger>
					</Tabs.List>
				</div>
			</div>

			<Tabs.Content value="pinned" class="w-full  pb-14 ">
				<UserPostList data={pinnedPosts} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="public" class="w-full  pb-14 ">
				<UserPostList data={publicPosts} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="private" class="w-full  pb-14 ">
				<UserPostList data={privatePosts} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="liked" class="pb-14 w-full  ">
				<UserPostList data={likedPosts} isLikes={true} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
