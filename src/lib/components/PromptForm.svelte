<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createNewPost, generateImage, postsByFollowed } from '@/api';
	import { store } from '$lib/store';
	import type { DartsJobData, JobSpec, Output, Post } from '@/types';
	import { v4 as uuidv4 } from 'uuid';
	import type { UploadResponse } from 'pinata';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';

	let { section } = $props();
	let text = $state('');
	let postFromFollowedUsers = $derived(postsByFollowed($store.user?.id || '0'));

	const onclick = async () => {
		store.updateLoader(true);
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

		if (!data) {
			toast.error('Error', {
				description: 'File generation failed'
				// action: {
				// 	label: 'Undo',
				// 	onClick: () => console.info('Undo')
				// }
			});
			store.updateLoader(false);
		} else {
			createNewPost(post);
			store.updateLoader(false);
			text = '';
		}
	};
</script>

{#if section == 'body'}
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
{:else}
	<form
		class={`${$page.url.pathname.startsWith('/details') || $page.url.pathname.startsWith('/profile') ? 'flex' : 'hidden'} h-12 w-full max-w-6xl items-center`}
	>
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
{/if}
