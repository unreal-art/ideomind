<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Ellipsis, Heart } from 'lucide-svelte';
	import type { Post } from '@/types';
	import { likePost, getPostLikeCount } from '@/api';
	import { store } from '$lib/store';

	import { getUserLikedPosts } from '@/api';
	import Image from '../Image.svelte';

	let likedPosts = $derived(getUserLikedPosts($store.user?.id));
	let {
		data,
		isLikes,
		triggerRefetch
	}: { data: Post[]; isLikes?: boolean; triggerRefetch?: () => void } = $props();

	const like = (item: Post) => {
		if (!$store.user?.id) return;

		likePost(item.id, $store.user?.id);
		triggerRefetch && triggerRefetch();
	};

	const isInLikedPosts = (id: string): boolean => {
		return likedPosts.filter((item) => item.id == id).length > 0;
	};
</script>

<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
	{#each data as item}
		<div class="relative mb-6 break-inside-avoid">
			<div class="absolute bottom-1 right-0 flex items-center text-white">
				<Button variant="ghost"><Ellipsis size={20}></Ellipsis></Button>

				<Button
					variant="ghost"
					onclick={() => like(item)}
					class="flex space-x-2 hover:bg-black/50 hover:text-white"
				>
					<span>{getPostLikeCount(item.id, $store.posts)}</span>
					<Heart
						size={20}
						class={`${isLikes || isInLikedPosts(item.id) ? 'fill-pink-500 text-pink-500' : ''}`}
					></Heart></Button
				>
			</div>
			<a href={`/details/${item.id}`}><Image {item} /></a>
		</div>
	{/each}
</div>
