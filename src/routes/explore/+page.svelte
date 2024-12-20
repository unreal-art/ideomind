<script lang="ts">
	import * as Tabs from "$lib/components/ui/tabs";
	import { postsByFollowed } from "@/api";
	import PostList from "@/components/explore/PostList.svelte";
	import { store } from "$lib/store";
	import PromptForm from "@/components/PromptForm.svelte";
	import { supabase } from "../../supabaseClient";
	import type { PageData } from "./$types";
	import { goto } from "$app/navigation";
	import type { Post } from "@/types";

	let postFromFollowedUsers = $state<Post[]>([]);
	let { data }: { data: PageData } = $props();

	$effect(() => {
		if (!data.user || !$store.isAuthenticated) goto("/");
	});

	$effect(() => {
		async function getPostOfFollowee() {
			postFromFollowedUsers = await postsByFollowed($store.user?.id || "0");
		}

		getPostOfFollowee();
	});

	// $effect(() => {
	// 	async function getUser() {
	// 		const {
	// 			data: { user }
	// 		} = await supabase.auth.getUser();
	// 		console.log(user);
	// 	}
	// 	getUser();
	// });
</script>

<section class="h-full w-full overflow-auto px-2">
	<div class="hidden h-[20%] flex-col items-center justify-center gap-3 lg:flex">
		<h2 class="text-sm font-semibold md:text-2xl lg:text-4xl">Unleash your creative juice.</h2>
		<PromptForm section={"body"} />
	</div>
	<div class="h-full lg:h-[79%]">
		<Tabs.Root value="explore" class="h-full w-full">
			<div class="fixed top-0 h-[8%] w-full bg-stone-50 lg:relative">
				<Tabs.List class="h-full bg-transparent">
					<Tabs.Trigger value="explore">Explore</Tabs.Trigger>
					<Tabs.Trigger value="following">Following</Tabs.Trigger>
					<Tabs.Trigger value="top">Top</Tabs.Trigger>
				</Tabs.List>
			</div>
			<Tabs.Content value="explore" class="h-[92%] w-full  ">
				<PostList data={$store.posts} />
			</Tabs.Content>
			<Tabs.Content value="following">
				<PostList data={postFromFollowedUsers} />
			</Tabs.Content>
			<Tabs.Content value="top">
				<PostList data={$store.posts} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
