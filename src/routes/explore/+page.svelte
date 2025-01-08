<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import { postsByFollowed } from "@/api";
	import PostList from "@/components/explore/PostList.svelte";
	import { store } from "$lib/store";
	import PromptForm from "@/components/PromptForm.svelte";
	import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import type { Post } from "@/types";
	import SearchBox from "@/components/SearchBox.svelte";
	import { supabase } from "@src/supabaseClient";

	let postFromFollowedUsers = $state<Post[]>([]);
	let posts = $state<Post[]>([])
	let { data }: { data: PageData } = $props();
	let loading  = $state(false)
	let sectionElement: HTMLElement | null = $state(null);

	let offset = $state(10);

async function loadMore() {
	
	loading = true
    const { data: newPosts, error } = await supabase
        .from("posts")
        .select("*")
        .order("createdAt", { ascending: false })
        .range(offset, offset + 9); // Fetch the next 10 posts

    if (error) {
		loading = false
        console.error("Error loading more posts:", error);
        return;
    }

    if (newPosts?.length) {
        posts = [...posts, ...newPosts ]; // Assuming your store has an `addPosts` method
		// console.log(posts)
        offset += 10; // Increment offset
    }
	loading = false

}


	$effect(() => {
		if (!$store.isAuthenticated) goto("/");
	});

	$effect(() => {
		async function getPostOfFollowee() {
			postFromFollowedUsers = await postsByFollowed($store.user?.id || "0", posts);
		}

		getPostOfFollowee();
	});

	$effect(() => {
		if (!data.posts) return;
		posts = data.posts
	});
	  const handleScroll = () => {
  if (!sectionElement || loading || posts.length < 10) return;

  // Check if the user is very near the bottom of the section
  const { scrollTop, scrollHeight, clientHeight } = sectionElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) { // Trigger closer to the bottom
    loadMore()
  }
};



  // Use effect for setting up and tearing down the event listener
  
$effect(() => {
    if (sectionElement) {
   
      sectionElement.addEventListener("scroll", handleScroll);

      return () => {
       
      sectionElement &&  sectionElement.removeEventListener("scroll", handleScroll);
      };
    }
  });



	
</script>

<section bind:this={sectionElement} class="h-full w-full overflow-auto px-2 relative ">
	<div class="hidden h-[20%] flex-col items-center justify-center gap-3 lg:flex">
		<h2 class="text-sm font-semibold md:text-2xl lg:text-4xl">Unleash your creative juice.</h2>
		<PromptForm section={"body"} />
	</div>
	<div class="h-full">
		
		

		<div class="h-full   ">
			<Tabs.Root value="explore" class="w-full h-full">
			<div class="fixed flex top-0 left-0 h-[8%] lg:h-[5%] w-full bg-stone-50 dark:bg-secondary lg:relative">
				<div class="flex h-full items-center" >
						<SearchBox />
					</div>
				<Tabs.List class="h-full bg-transparent gap-2">
					<Tabs.Trigger value="explore" class="dark:bg-black/55">Explore</Tabs.Trigger>
					<Tabs.Trigger value="following" class="dark:bg-black/55">Following</Tabs.Trigger>
					<Tabs.Trigger value="top" class="dark:bg-black/55">Top</Tabs.Trigger>
				</Tabs.List>
			</div>
			<Tabs.Content value="explore" class=" w-full pb-14 ">
				<PostList data={posts} />
				{#if loading}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="following" class=" w-full  pb-14">
				<PostList data={postFromFollowedUsers} />
				{#if loading}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>
			<Tabs.Content value="top" class=" w-full pb-14">
				<PostList data={posts} />
				{#if loading}
				<div class="text-center   rounded-md mb-14   text-sm text-black right-0 p-2 w-fit m-auto bg-primary dark:bg-secondary dark:text-white">Loading more data..</div>
				{/if}
			</Tabs.Content>

		</Tabs.Root>
		</div>
	</div>

	
</section>

