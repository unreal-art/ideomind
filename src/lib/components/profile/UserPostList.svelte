<script lang="ts">
	import type { Post } from "@/types";
	import Image from "../Image.svelte";
	import More from "../More.svelte";
	import Likes from "@/Likes.svelte";
	let readyBlocks = $state<string[]>([]);

	function onReadyEvent(data: string) {
		readyBlocks.push(data);
	}

	let { data, loading }: { data: Post[]; isLikes?: boolean; loading: boolean } = $props();

	const popLiked = (id: string) => {
		data = data.filter((post) => post.id !== id);
	};
</script>

{#if loading}
	{#if loading || (readyBlocks.length == 0 && data.length > 0)}
		<div class="flex h-[100vh] items-center justify-center">
			<div class="flex items-center space-x-2">
				<!-- Spinner -->
				<div
					class="h-6 w-6 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"
				></div>
			</div>
		</div>
	{/if}
{:else}
	<div
		class=" grid grid-cols-1 justify-center gap-4 pb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
	>
		{#each data as item}
			<div class="relative mb-6 break-inside-avoid">
				{#if readyBlocks.includes(item.id)}
					<div class="absolute bottom-1 right-0 flex items-center text-white">
						<!-- <More /> -->
						<Likes id={item.id} post={item} {popLiked} />
					</div>
				{/if}
				<a href={`/details/${item.id}`}><Image {item} {onReadyEvent} /></a>
			</div>
		{/each}
	</div>
{/if}
