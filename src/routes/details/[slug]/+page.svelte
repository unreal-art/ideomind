<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import image1 from '$lib/assets/ima1.jpg';
	import image2 from '$lib/assets/ima2.jpeg';
	import { Ellipsis, Heart, Files, Plus } from 'lucide-svelte';
	import Separator from '@/components/ui/separator/separator.svelte';
	import { page } from '$app/stores';
	import {
		getPost,
		getPostUserImage,
		getPostUserName,
		likePost,
		userLikedPosts,
		userOtherPosts
	} from '@/api';
	import type { Post, UploadResponse } from '@/types';
	import { store } from '$lib/store';

	import { getImageUrl } from '@/api';
	import { formatDistanceToNow } from 'date-fns';
	import ImageComponent from '@/components/Image.svelte';

	let likedPosts = $derived(userLikedPosts($store.user?.id));

	let imageUrls = $state(['']);
	let params = $derived($page.params);
	let post: Post = $derived(getPost(params.slug, $store.posts) as Post);
	let otherPosts: Post[] = $derived(userOtherPosts(post.author, post.id, $store.posts));
	let resolution = $state('');

	let fullPrompt = $state(false);
	let fullMagicPrompt = $state(false);
	let text = $derived(post.prompt);

	const like = (item: Post) => {
		if (!$store.user?.id) return;
		likePost(item.id, $store.user?.id);
	};

	const isInLikedPosts = (id: string): boolean => {
		return likedPosts.filter((item) => item.id == id).length > 0;
	};

	const getDate = (date: Date | undefined): string => {
		if (!date) return '';
		const month = date.toLocaleString('default', { month: 'short' }); // Get full month name (e.g., 'December')
		const year = date.getFullYear();
		let hour = date.getHours();
		const mins = date.getMinutes().toString().padStart(2, '0'); // Ensure minutes are 2 digits
		const amOrPm = hour >= 12 ? 'pm' : 'am'; // Determine AM or PM
		hour = hour % 12 || 12; // Convert to 12-hour format, adjust for 0 to 12

		return `${month} ${year} at ${hour}:${mins} ${amOrPm}`;
	};

	const getImages = async (imgs: UploadResponse[]) => {
		imageUrls = (await Promise.all(
			imgs.map(async (item) => await getImageUrl(item.cid))
		)) as string[];
	};

	const getImageResolution = async (url: string) => {
		const img = new Image();
		return new Promise((resolve, reject) => {
			img.onload = () => resolve({ width: img.width, height: img.height });
			img.onerror = () => reject(new Error('Failed to load image'));
			img.src = url; // Start loading the image
		});
	};

	$effect(() => {
		const fetchResolution = async () => {
			const result: { width: string; height: string } = (await getImageResolution(
				imageUrls[0]
			)) as { width: string; height: string };
			resolution = `${result.width} X ${result.height}`;
		};
		fetchResolution();
	});

	$effect(() => {
		getImages(post.ipfsImages);
	});
</script>

<section class="relative h-full w-full overflow-y-auto px-2">
	<section class="min-h-[92vh] w-full lg:flex">
		<div class="flex h-full items-center justify-center lg:w-[75%]">
			<img src={imageUrls[0]} alt="view" class=" max-h-[92vh]" />
		</div>
		<div
			class="flex h-full flex-col gap-5 overflow-y-scroll rounded-md border bg-white px-2 py-4 shadow lg:w-[25%]"
		>
			<!-- user details -->
			<div class="mt-3 flex h-10 w-full justify-between">
				<div class="relative flex h-full space-x-2">
					<img src={getPostUserImage(post.author)} alt="user profile" class="h-full rounded-full" />
					<div class=" flex flex-col">
						<p class="text-sm">{getPostUserName(post.author)}</p>
						<p class="text-light text-sm text-gray-400">
							{formatDistanceToNow(post.createdAt)} ago
						</p>
					</div>
				</div>
				<Button class="h-fit w-fit rounded-full bg-red-500 p-1   px-2 text-xs">follow</Button>
				<div class="flex items-center">
					<Button variant="ghost"><Ellipsis size={20} /></Button>
					<p class="text-light text-sm">{post.likes}</p>
					<Button variant="ghost" onclick={() => like(post)}
						><Heart
							size={20}
							class={`${isInLikedPosts(post.id) ? 'fill-pink-500 text-pink-500' : ''}`}
						/></Button
					>
				</div>
			</div>

			<!-- image list -->
			<div class="flex h-28 gap-3 overflow-x-auto">
				{#each imageUrls as img}
					<div class="h-full w-[25%] opacity-40">
						<img src={img} alt="view" class=" h-full w-full rounded-md" />
					</div>
				{/each}
			</div>

			<Separator />

			<!-- prompt -->

			<div class="flex flex-col gap-2">
				<div class="flex h-12 w-full items-center justify-between">
					<p class="font-semibold">Prompt</p>
					<div class="flex h-full items-center gap-3">
						<Button variant="outline" class="p-2 text-gray-500">
							<Plus size={20} />
						</Button>
						<Button variant="outline" class="p-2 text-gray-500">
							<Files size={20} />
						</Button>
					</div>
				</div>
				<p class="prose">
					{#if text.length > 200}
						{#if !fullPrompt}
							{text.substring(0, 200)}
							<Button
								variant="ghost"
								onclick={() => (fullPrompt = true)}
								class="cursor-pointer font-semibold underline"
							>
								...More
							</Button>
						{:else}
							{text}
							<Button
								variant="ghost"
								onclick={() => (fullPrompt = false)}
								class="cursor-pointer font-semibold underline"
							>
								Less
							</Button>
						{/if}
					{:else}
						{text}
					{/if}
				</p>
			</div>

			<Separator />

			<!--magic prompt -->
			<!-- <div class="flex flex-col gap-2">
				<div class="flex h-12 w-full items-center justify-between">
					<p class="font-semibold">Magic Prompt</p>
					<div class="flex h-full items-center gap-3">
						<Button variant="outline" class="p-2 text-gray-500">
							<Plus size={20} />
						</Button>
						<Button variant="outline" class="p-2 text-gray-500">
							<Files size={20} />
						</Button>
					</div>
				</div>
				<p class="prose">
					{#if text.length > 200}
						{#if !fullMagicPrompt}
							{text.substring(0, 200)}
							<Button
								variant="ghost"
								onclick={() => (fullMagicPrompt = true)}
								class="cursor-pointer font-semibold underline"
							>
								...More
							</Button>
						{:else}
							{text}
							<Button
								variant="ghost"
								onclick={() => (fullMagicPrompt = false)}
								class="cursor-pointer font-semibold underline"
							>
								Less
							</Button>
						{/if}
					{:else}
						{text}
					{/if}
				</p>
			</div>

			<Separator /> -->

			<!--other info -->

			<div class="grid grid-cols-2 gap-3">
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Model</p>
					<p class="font-extralight text-gray-500">Darts 1.0</p>
				</div>
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Style</p>
					<p class="font-extralight text-gray-500">3D</p>
				</div>
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Resolution</p>
					<p class="font-extralight text-gray-500">{resolution}</p>
				</div>
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Rendering</p>
					<p class="font-extralight text-gray-500">Default</p>
				</div>
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Seed</p>
					<p class="font-extralight text-gray-500">1128237678</p>
				</div>
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Date created</p>
					<p class="font-extralight text-gray-500">{getDate(new Date(post.createdAt))}</p>
				</div>
			</div>
		</div>
	</section>

	<!-- More from user -->
	<div class="my-10 flex h-12 w-full items-center justify-center space-x-3">
		<p>More from</p>

		<img src={getPostUserImage(post.author)} alt="user profile" class="h-full rounded-full" />
		<p>{getPostUserName(post.author)}</p>
	</div>

	<!-- image list -->

	<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
		{#each otherPosts as post}
			<div class="mb-6 break-inside-avoid">
				<ImageComponent item={post} />
				<div class="mt-3 flex h-10 w-full items-center justify-end">
					<Button variant="ghost"><Ellipsis size={20} /></Button>
					<p class="text-light text-sm">{post.likes}</p>
					<Button variant="ghost" onclick={() => like(post)}
						><Heart
							size={20}
							class={`${isInLikedPosts(post.id) ? 'fill-pink-500 text-pink-500' : ''}`}
						/></Button
					>
				</div>
			</div>
		{/each}
	</div>
</section>
