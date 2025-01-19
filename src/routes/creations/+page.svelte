<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import * as Tabs from "$lib/components/ui/tabs";
	import { ListFilter } from "lucide-svelte";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import CreationList from "@/components/creations/CreationList.svelte";
	import { store } from "$lib/store";
	import { fetchCreationsPost } from "@/api";
	import PromptForm from "@/components/PromptForm.svelte";
	import type { PageData } from "../$types";
	import type { Post } from "@/types";
	import SearchBox from "@/components/SearchBox.svelte";
	import { supabase } from "@src/supabaseClient";

	const choices = [
		{ value: "everything", label: "Everything" },
		{ value: "generation", label: "Generations" },
		{ value: "edit", label: "Edits" },
		{ value: "upload", label: "Uploads" },
		{ value: "upscale", label: "Upscales" }
	];
	let selectedChoice = $state("everything");

	const triggerContent = $derived(
		choices.find((f) => f.value === selectedChoice)?.label ?? "Filter"
	);

	let { data }: { data: PageData } = $props();
	let showInput: boolean = $state(false);
	
	let pinnedPosts = $state<Post[]>([]);
	let privatePosts = $state<Post[]>([]);
	let publicPosts = $state<Post[]>([]);
	let loading = $state(true);
	let loadingMore = $state(false);
	let sectionElement: HTMLElement | null = $state(null);
	let offset = $state(10);

	//@ts-ignore
	let posts = $state<Post[]>(data.posts as Post[]);

	

	// Toggle input visibility
	const toggleInput = (): void => {
		showInput = true;
	};



	const reloadData = async () => {
		loading = true;
		const data = await fetchCreationsPost();
		posts = data.posts;
		loading = false;
	};


async function loadMore() {
	
	loadingMore = true
    const { data: newPosts, error } = await supabase
        .from("posts")
        .select("*")
		// @ts-ignore
		.eq("author", $store.user.id) // Filter posts by the author_id
		.order("createdAt", { ascending: false })
        .range(offset, offset + 9); // Fetch the next 10 posts

    if (error) {
		loadingMore = false
        console.error("Error loading more posts:", error);
        return;
    }

    if (newPosts?.length) {
        posts = [...posts, ...newPosts ]; // Assuming your store has an `addPosts` method
		// console.log(posts)
        offset += 10; // Increment offset
    }
	
	loadingMore = false
}

	//fill posts
	$effect(() => {
		//@ts-ignore
		if (!data.posts) return;
		pinnedPosts = posts.filter((item: Post) => item.isPinned);
		privatePosts = posts.filter((item: Post) => item.isPrivate);
		publicPosts = posts.filter((item: Post) => !item.isPrivate);
		loading = false;
	});

		  const handleScroll = () => {
  if (!sectionElement || loadingMore || posts.length < 10) return;

  // Check if the user is very near the bottom of the section
  const { scrollTop, scrollHeight, clientHeight } = sectionElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) { // Trigger closer to the bottom
    loadMore();
  }
};

	$effect(() => {
    if (sectionElement) {
      
      sectionElement.addEventListener("scroll", handleScroll);

      return () => {
     
      sectionElement &&  sectionElement.removeEventListener("scroll", handleScroll);
      };
    }
  });

</script>

<section bind:this={sectionElement}  class="h-full w-full overflow-auto px-2">
	<div class="hidden h-[20%] flex-col items-center justify-center gap-3 z-20 lg:flex">
		<h2 class="text-sm font-semibold md:text-2xl lg:text-4xl">Unleash your creative juice.</h2>
		<PromptForm section={"body"} />
	</div>
	<div class="h-full ">
		<Tabs.Root onValueChange={() => reloadData()} value="all" class="h-full w-full ">
			<div class="fixed left-0 top-0 z-10 flex h-12 w-full justify-between bg-stone-50 dark:bg-secondary items-center lg:relative">
				
				<div class=" flex h-full items-center space-x-1">
					<div class="flex h-full items-center" >
						<SearchBox />
					</div>
					<Tabs.List class="h-[5%] bg-transparent gap-2">
						<Tabs.Trigger value="all" class="dark:bg-black/55">All</Tabs.Trigger>
						<!-- <Tabs.Trigger value="pinned" class="dark:bg-black/55">Pinned</Tabs.Trigger> -->
						<Tabs.Trigger value="public" class="dark:bg-black/55">Public</Tabs.Trigger>
						<Tabs.Trigger value="private" class="dark:bg-black/55">Private</Tabs.Trigger>
					</Tabs.List>

					<div class="flex h-full items-center lg:hidden ">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger class={buttonVariants({ variant: "ghost" })}>
								<ListFilter size={20} /></DropdownMenu.Trigger
							>
							<DropdownMenu.Content class="w-56 ">
								<DropdownMenu.Group>
									<DropdownMenu.GroupHeading>Filter</DropdownMenu.GroupHeading>
									<DropdownMenu.Separator />
									<DropdownMenu.RadioGroup bind:value={selectedChoice}>
										{#each choices as choice}
											<DropdownMenu.RadioItem value={choice.value}
												>{choice.label}</DropdownMenu.RadioItem
											>
										{/each}
									</DropdownMenu.RadioGroup>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
				<div class="hidden h-full lg:flex items-center ">
					<Select.Root type="single" name="choice"  bind:value={selectedChoice}>
						<Select.Trigger class="w-[180px] focus-visible:ring-0 outline-none focus:ring-0">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.GroupHeading>Filter</Select.GroupHeading>
								{#each choices as choice}
									<Select.Item value={choice.value} label={choice.label}>{choice.label}</Select.Item
									>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Tabs.Content value="all" class="w-full  pb-14 ">
				<CreationList data={posts} choice={selectedChoice} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-white right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
			<!-- <Tabs.Content value="pinned" class=" w-full pb-14">
				<CreationList data={pinnedPosts} choice={selectedChoice} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content> -->
			<Tabs.Content value="public" class=" w-full pb-14">
				<CreationList data={publicPosts} choice={selectedChoice} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-white right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="private" class=" w-full pb-14">
				<CreationList data={privatePosts} choice={selectedChoice} {loading} />
				{#if loadingMore}
				<div class="text-center   rounded-md mb-14   text-sm text-white right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
