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
	<div class="flex h-[100vh] items-center justify-center">
  <div class="flex items-center space-x-2">
    <!-- Spinner -->
    <div class="h-6 w-6 animate-spin rounded-full border-4 border-t-transparent border-gray-400"></div>
  </div>
</div>

{:else}
	<div class=" grid  grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-6">
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
