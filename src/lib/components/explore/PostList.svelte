<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import image1 from '$lib/assets/ima1.jpg';
	import image2 from '$lib/assets/ima2.jpeg';
	import { Ellipsis, Heart } from 'lucide-svelte';
	import type { Post } from '@/types';
	import { formatDistanceToNow } from 'date-fns';

	let { data }: { data: Post[] } = $props();

	let imgs = [image1, image2];
</script>

<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
	{#each data as item, index}
		<div class="mb-6 break-inside-avoid">
			<img src={imgs[(index + 2) % 2]} alt="user profile" class="mb-6 w-full rounded-sm" />
			<div class="mt-3 flex h-10 w-full items-center justify-between">
				<div class="flex h-full space-x-2">
					<img src={image1} alt="user profile" class="h-full rounded-full" />
					<div class="flex flex-col">
						<p class="text-sm">{item.author}</p>
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
