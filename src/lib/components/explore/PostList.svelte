<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Heart } from "lucide-svelte";
	import type { Post } from "@/types";
	import { formatDistanceToNow } from "date-fns";
	import { likePost, getUserLikedPosts } from "@/api";
	import { store } from "$lib/store";
	import Image from "../Image.svelte";
	import More from "../More.svelte";
	import PostImage from "../PostImage.svelte";
	import PostAuthor from "../PostAuthor.svelte";

	// let likedPosts = $derived(getUserLikedPosts($store.user?.id));
	let { data }: { data: Post[] } = $props();

	const like = (item: Post) => {
		if (!$store.user?.id) return;
		likePost(item.id as string, $store.user?.id);
	};

	const isInLikedPosts = (likes: any[]): boolean => {
		return likes.filter((item) => item.author === $store.user?.id).length > 0;
	};
</script>

<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
	{#each data as item}
		<div class="mb-6 break-inside-avoid">
			<Image {item} />
			<div class="mt-3 flex h-10 w-full items-center justify-between">
				<div class="flex h-full space-x-2">
					<PostImage authorId={item.author} />
					<div class="flex flex-col">
						<PostAuthor authorId={item.author} />
						<p class="text-light text-sm text-gray-400">
							{item.createdAt && formatDistanceToNow(item.createdAt)} ago
						</p>
					</div>
				</div>
				<div class="flex items-center">
					<More />
					<Button
						variant="ghost"
						onclick={() => like(item)}
						class="flex space-x-2 hover:bg-black/50 hover:text-white"
					>
						<span>{item.likes.length}</span>
						<Heart
							size={20}
							class={`${isInLikedPosts(item.likes) ? "fill-pink-500 text-pink-500" : ""}`}
						></Heart></Button
					>
				</div>
			</div>
		</div>
	{/each}
</div>
