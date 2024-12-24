<script lang="ts">
	import type { Post } from "@/types";
	import { formatDistanceToNow } from "date-fns";
	import { likePost, getUserLikedPosts } from "@/api";

	import Image from "../Image.svelte";
	import More from "../More.svelte";
	import PosterImage from "../PosterImage.svelte";
	import PostAuthor from "../PostAuthor.svelte";
	import Likes from "@/Likes.svelte";

	// let likedPosts = $derived(getUserLikedPosts($store.user?.id));
	let { data }: { data: Post[] } = $props();
</script>

<div class=" grid  grid-cols-1 justify-center gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-6">
	{#each data as post}
		<div class="mb-6 break-inside-avoid">
			<Image item={post} />
			<div class="mt-3 flex h-10 w-full items-center justify-end">
				<More />
				<Likes id={post.id} {post} />
			</div>
		</div>
	{/each}
</div>
