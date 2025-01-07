<script lang="ts">
	import { AiOutlineDiscord } from 'svelte-icons-pack/ai';
	import * as Dialog from "$lib/components/ui/dialog";
	import { Search } from "lucide-svelte";
	import { Button } from "./ui/button";
	import Input from "./ui/input/input.svelte";
	import * as Tabs from "$lib/components/ui/tabs";
	import { supabase } from "../../supabaseClient";
	import type { User, Post } from "@/types";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import SearchPostImage from './SearchPostImage.svelte';

	
	let text = $state("");

	let postsData = $state<Post[]>([]);
	let creators = $state<any[]>([]);

	// Function to search posts and profiles
	async function searchPostsAndProfiles(keyword: string) {
	

		// Search in posts
		const { data: posts, error: postsError } = await supabase
			.from('posts')
			.select('*') // Select all fields or specify the fields you need
			.ilike('prompt', `%${keyword}%`)
			.order('id', { ascending: false });

		if (postsError) {
			console.error('Error fetching posts:', postsError);
			throw postsError;
		}

		// Search in profiles
		const { data: profiles, error: profilesError } = await supabase
			.from('profiles')
			.select('*') // Select all fields or specify the fields you need
			.ilike('full_name', `%${keyword}%`)
			.order('id', { ascending: false });

		if (profilesError) {
			console.error('Error fetching profiles:', profilesError);
			throw profilesError;
		}

		console.log("posts", posts, "creators", profiles);
		postsData = posts;
		creators = profiles;

		return { posts, profiles };
	}

   function getInitials(name: string): string {
  // Split the name into words and filter out empty strings (e.g., extra spaces)
  const words = name.trim().split(/\s+/);
  
  // Extract the first letter of each word
  const initials = words.map(word => word[0].toUpperCase());

  // Combine the first two initials, or fewer if there are not enough words
  return initials.slice(0, 2).join('');
}

	// Function to get the first 100 words from text
	function getFirst100Words(text: string) {
		const words = text.split(/\s+/); // Split the text into words using whitespace as a delimiter
		return words.slice(0, 20).join(' '); // Return the first 100 words joined into a string
	}

	// Effect to perform search whenever text changes
	$effect(() => {
      if(!text) {
         creators=[]
         postsData=[]
         return
      }
		searchPostsAndProfiles(text);
		console.log(text);
	});
</script>

<Dialog.Root >
	<Dialog.Trigger>
		<Button variant="ghost" class="h-full">
			<Search size={20} />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Search</Dialog.Title>
			<Dialog.Description>
				You can search creators and prompts.
			</Dialog.Description>
		</Dialog.Header>

		<div class="grid gap-4 py-4">
			<div class="items-center gap-4">
				<Input
					bind:value={text}
					id="search"
					placeholder="search...."
					class="w-full rounded-full h-12"
				/>
			</div>
		</div>

		<Tabs.Root value="creators" class="w-full">
			<Tabs.List class="w-full bg-secondary justify-start gap-2">
				<Tabs.Trigger value="creators" class="dark:bg-black">
					Creators
				</Tabs.Trigger>
				<Tabs.Trigger value="posts" class="dark:bg-black">
					Posts
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="creators" class="h-[50vh] overflow-y-auto">
				{#if creators.length === 0}
					<span class="text-center text-sm">No data found.</span>
				{/if}
				{#each creators as creator}
					<a href={`/profile/${creator.id}`}>
						<div class="h-12 flex border-b items-center text-gray-400 hover:text-white">
							<div class="w-[20%]">
								<Avatar.Root>
                           
									<Avatar.Image src={creator.avatar_url} alt="@shadcn" />
									<Avatar.Fallback>{getInitials(creator.full_name)}</Avatar.Fallback>
								</Avatar.Root>
							</div>
							<div class="text-sm font-normal">{creator.full_name}</div>
						</div>
					</a>
				{/each}
			</Tabs.Content>

			<Tabs.Content value="posts" class="h-[50vh] overflow-y-auto">
				{#if postsData.length === 0}
					<span class="text-center text-sm">No data found.</span>
				{/if}
				{#each postsData as post}
					<a href={`/details/${post.id}`} >
						<div class="max-h-28 flex items-center gap-3 mb-2 text-gray-400 hover:text-white">
							<div class="w-[20%] h-full">
								<SearchPostImage item={post} />
							</div>
							<div class="w-[80%] h-full text-sm">
								{getFirst100Words(post.prompt)}...
							</div>
						</div>
					</a>
				{/each}
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
