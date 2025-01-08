<script lang="ts">
	import type { Post } from "@/types";
	import { formatDistanceToNow } from "date-fns";
	import { likePost, getUserLikedPosts } from "@/api";

	import Image from "../Image.svelte";
	import More from "../More.svelte";
	import PosterImage from "../PosterImage.svelte";
	import PostAuthor from "../PostAuthor.svelte";
	import Likes from "@/Likes.svelte";

	let readyBlocks = $state<string[]>([])

	let { data }: { data: Post[] } = $props();
	function onReadyEvent(data: string){
		readyBlocks.push(data)
	}

</script>

<div class=" grid  grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-6 pt-14 lg:pt-4">
	{#each data as item}
	<div class="mb-6 break-inside-avoid">
		<Image {item} {onReadyEvent}/>
		{#if readyBlocks.includes(item.id)}
			<div class="mt-3 flex h-10 w-full items-center justify-between">
				<a href={`/profile/${item.author}`}>
				<div class="flex h-full space-x-2">
					<PosterImage authorId={item.author} />
					<div class="flex flex-col">
						<PostAuthor authorId={item.author} />
						<p class="text-light text-sm text-gray-400">
							{item.createdAt && formatDistanceToNow(item.createdAt)} ago
						</p>
					</div>
				</div>
			</a>
				<div class="flex items-center">
					<More />
					<Likes id={item.id} post={item} />
				</div>
			</div>
				{/if}
		</div>
	
	{/each}
</div>
