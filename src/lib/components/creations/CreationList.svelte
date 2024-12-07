<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Ellipsis, Heart } from 'lucide-svelte';
	import type { Post } from '@/types';
	import { filterPostByCat, likePost } from '@/api';
	import { store } from '$lib/store';

	import { userLikedPosts } from '@/api';
	let likedPosts = $derived(userLikedPosts($store.user?.id));
	let { data, choice }: { data: Post[]; choice: string } = $props();
	let posts = $derived(filterPostByCat(data, choice));

	const like = (item: Post) => {
		if (!$store.user?.id) return;
		likePost(item.id, $store.user?.id);
	};

	const isInLikedPosts = (id: string): boolean => {
		return likedPosts.filter((item) => item.id == id).length > 0;
	};

	$inspect(choice);
</script>

<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
	{#each posts as item: Post}<div class="relative mb-6 break-inside-avoid">
			<div class="absolute bottom-1 right-0 flex items-center text-white">
				<Button variant="ghost"><Ellipsis size={20}></Ellipsis></Button>

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
			<img src={item.images[0]} alt="user profile" class="mb-6 w-full rounded-sm" />
		</div>
	{/each}
</div>
