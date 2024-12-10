<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Ellipsis, Heart } from 'lucide-svelte';
	import type { Post } from '@/types';
	import { formatDistanceToNow } from 'date-fns';
	import { getPostUserImage, getPostUserName, likePost, userLikedPosts } from '@/api';
	import { store } from '$lib/store';
	import Image from './Image.svelte';

	let likedPosts = $derived(userLikedPosts($store.user?.id));
	let { data }: { data: Post[] } = $props();

	const like = (item: Post) => {
		if (!$store.user?.id) return;
		likePost(item.id, $store.user?.id);
	};

	const isInLikedPosts = (id: string): boolean => {
		return likedPosts.filter((item) => item.id == id).length > 0;
	};
</script>

<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
	{#each data as item}
		<div class="mb-6 break-inside-avoid">
			<Image {item} />
			<div class="mt-3 flex h-10 w-full items-center justify-between">
				<div class="flex h-full space-x-2">
					<img src={getPostUserImage(item.author)} alt="user profile" class="h-full rounded-full" />
					<div class="flex flex-col">
						<p class="text-sm">{getPostUserName(item.author)}</p>
						<p class="text-light text-sm text-gray-400">
							{formatDistanceToNow(item.createdAt)} ago
						</p>
					</div>
				</div>
				<div class="flex items-center">
					<Button variant="ghost"><Ellipsis size={20} /></Button>
					<Button
						variant="ghost"
						onclick={() => like(item)}
						class="flex space-x-2 hover:bg-black/50 hover:text-white"
					>
						<span>{item.likes}</span>
						<Heart
							size={20}
							class={`${isInLikedPosts(item.id) ? 'fill-pink-500 text-pink-500' : ''}`}
						></Heart></Button
					>
				</div>
			</div>
		</div>
	{/each}
</div>
