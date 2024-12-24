<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Ellipsis, Heart } from "lucide-svelte";
	import type { Post } from "@/types";
	import { likePost, getPostLikeCount } from "@/api";
	import { store } from "$lib/store";

	import { getUserLikedPosts } from "@/api";
	import Image from "../Image.svelte";
	import More from "../More.svelte";
	import Likes from "@/Likes.svelte";

	// let likedPosts = $derived(getUserLikedPosts($store.user?.id));
	let { data, isLikes, loading }: { data: Post[]; isLikes?: boolean; loading: boolean } = $props();

	const popLiked = (id: string) => {
		data = data.filter((post) => post.id !== id);
	};
</script>

{#if loading}
	<div class="flex h-[50vh] items-center justify-center bg-gray-100">
		<div class="flex items-center space-x-2">
			<!-- <div class="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div> -->
			<span class="font-medium text-gray-600">Please wait...</span>
		</div>
	</div>
{:else}
	<div class=" grid  grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-6">
		{#each data as item}
			<div class="relative mb-6 break-inside-avoid">
				<div class="absolute bottom-1 right-0 flex items-center text-white">
					<More />
					<Likes id={item.id} post={item} {popLiked} />
				</div>
				<a href={`/details/${item.id}`}><Image {item} /></a>
			</div>
		{/each}
	</div>
{/if}
