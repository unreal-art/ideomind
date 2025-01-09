<script lang="ts">
	import type { Post } from "@/types";

	import Image from "../Image.svelte";
	import More from "../More.svelte";
	import Likes from "@/Likes.svelte";
	let readyBlocks = $state<string[]>([]);

	// let likedPosts = $derived(getUserLikedPosts($store.user?.id));
	let { data }: { data: Post[] } = $props();

	function onReadyEvent(data: string) {
		readyBlocks.push(data);
	}
</script>

<div
	class=" grid grid-cols-1 justify-center gap-4 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
>
	{#each data as post}
		<div class="mb-6 break-inside-avoid">
			<Image item={post} {onReadyEvent} />
			{#if readyBlocks.includes(post.id)}
				<div class="mt-3 flex h-10 w-full items-center justify-end">
					<More />
					<Likes id={post.id} {post} />
				</div>
			{/if}
		</div>
	{/each}
</div>
