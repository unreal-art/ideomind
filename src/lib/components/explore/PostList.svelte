<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Ellipsis, Heart } from 'lucide-svelte';
	import type { Post } from '@/types';
	import { formatDistanceToNow } from 'date-fns';
	import { getPostUserImage, getPostUserName } from '@/api';

	let { data }: { data: Post[] } = $props();
</script>

<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
	{#each data as item}
		<div class="mb-6 break-inside-avoid">
			<img src={item.images[0]} alt="user profile" class="mb-6 w-full rounded-sm" />
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
					<p class="text-light text-sm">{item.likes}</p>
					<Button variant="ghost"><Heart size={20} /></Button>
				</div>
			</div>
		</div>
	{/each}
</div>
