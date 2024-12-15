<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Ellipsis, Heart } from 'lucide-svelte';
	import type { Post } from '@/types';
	import { filterPostByCat, likePost, getUserLikedPosts } from '@/api';
	import { store } from '$lib/store';
	import Image from '../Image.svelte';
	import More from '../More.svelte';

	let likedPosts = $derived(getUserLikedPosts($store.user?.id));
	let { data, choice }: { data: Post[]; choice: string } = $props();
	let posts = $derived(filterPostByCat(data, choice));

	const like = (item: Post) => {
		if (!$store.user?.id) return;
		likePost(item.id, $store.user?.id);
	};

	const isInLikedPosts = (id: string): boolean => {
		return likedPosts.filter((item) => item.id == id).length > 0;
	};
</script>

<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
	{#each posts as item: Post}
		<div class="relative mb-6 break-inside-avoid">
			<div class="absolute bottom-1 right-0 flex items-center text-white">
				<More />

				<Button
					variant="ghost"
					onclick={() => like(item)}
					class="flex space-x-2 hover:bg-black/50 hover:text-white"
				>
					<span>{item.likes}</span>
					<Heart size={20} class={`${isInLikedPosts(item.id) ? 'fill-pink-500 text-pink-500' : ''}`}
					></Heart></Button
				>
			</div>
			<a href={`/details/${item.id}`}>
				<Image {item} />
			</a>
		</div>
	{/each}
</div>
