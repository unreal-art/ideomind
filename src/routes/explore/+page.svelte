<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import { createNewPost, generateImage, postsByFollowed } from '@/api';
	import PostList from '@/components/explore/PostList.svelte';
	import { store } from '$lib/store';
	import type { DartsJobData, JobSpec, Output, Post } from '@/types';
	import { v4 as uuidv4 } from 'uuid';
	import type { UploadResponse } from 'pinata';

	let text = $state('');
	let postFromFollowedUsers = $derived(postsByFollowed($store.user?.id || '0'));

	const onclick = async () => {
		const dto: JobSpec = {
			module: 'isdxl',
			version: 'v1.2.0',
			inputs: {
				Prompt: text,
				cpu: 30,
				Device: 'xpu'
			}
		};
		const data: Output | undefined = await generateImage(dto);
		//store the post
		const post: Post = {
			id: uuidv4(),
			author: $store.user?.id as string,
			isPrivate: false,
			prompt: text,
			isPinned: false,
			category: 'GENERATION',
			likes: 0,
			images: [],
			ipfsImages: data?.uploadResponse as UploadResponse[],
			cpu: dto.inputs?.cpu as number,
			device: dto.inputs?.Device as string,
			createdAt: new Date()
		};

		createNewPost(post);
	};
</script>

<section class="h-full w-full overflow-auto px-2">
	<div class="hidden h-[20%] flex-col items-center justify-center gap-3 lg:flex">
		<h2 class="text-sm font-semibold md:text-2xl lg:text-4xl">Unleash your creative juice</h2>
		<form class="flex h-12 w-full max-w-6xl items-center">
			<Input
				type="text"
				bind:value={text}
				placeholder="Describe what you want to see"
				class="h-full w-[60%] rounded-none rounded-l-2xl md:w-[80%]"
			/>
			<Button
				type="button"
				{onclick}
				class="h-full w-[40%] rounded-none rounded-r-2xl text-white md:w-[20%]">Generate</Button
			>
		</form>
	</div>
	<div class="h-full lg:h-[79%]">
		<Tabs.Root value="explore" class="h-full w-full">
			<div class="fixed top-0 h-[8%] w-full bg-stone-50 lg:relative">
				<Tabs.List class="h-full bg-transparent">
					<Tabs.Trigger value="explore">Explore</Tabs.Trigger>
					<Tabs.Trigger value="following">Following</Tabs.Trigger>
					<Tabs.Trigger value="top">Top</Tabs.Trigger>
				</Tabs.List>
			</div>
			<Tabs.Content value="explore" class="h-[92%] w-full  ">
				<PostList data={$store.posts} />
			</Tabs.Content>
			<Tabs.Content value="following">
				<PostList data={postFromFollowedUsers} />
			</Tabs.Content>
			<Tabs.Content value="top">
				<PostList data={$store.posts} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
