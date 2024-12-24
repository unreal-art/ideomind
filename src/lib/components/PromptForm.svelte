<script lang="ts">
	
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { createNewPost, fetchProfilePosts, generateImage, postsByFollowed } from '@/api';
	import { store } from '$lib/store';
	import { quickStore } from '$lib/quickStore';
	import type { DartsJobData, JobSpec, Output, Post } from '@/types';
	import { v4 as uuidv4 } from 'uuid';
	import type { UploadResponse } from 'pinata';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import Textarea from './ui/textarea/textarea.svelte';
	import { goto } from '$app/navigation';
	import random from "random"

	let { section } = $props();
	let text = $state('');

	let showInput: boolean = $state(false);
	let inputRef: HTMLDivElement | null = $state(null);
	let minorInputRef: HTMLInputElement | null = $state(null);
	let buttonInputRef: HTMLButtonElement | null = $state(null);
   	let val = $state('')
	
	const onclick = async () => {
		showInput=false

		quickStore.updateLoader(true);
		const dto: JobSpec = {
			module: 'isdxl',
			version: 'v1.3.0',
			inputs: {
				Prompt: text,
				cpu: 26,
				Device: 'xpu',
				Seed: random.int(100000)
			}
		};
		console.log(dto)
		const data: Output | undefined = await generateImage(dto);
		//store the post
		const post: Partial<Post> = {
			author: $store.user?.id as string,
			isPrivate: false,
			prompt: text,
			isPinned: false,
			category: 'GENERATION',
			ipfsImages: data?.uploadResponse as UploadResponse[],
			cpu: dto.inputs?.cpu as number,
			device: dto.inputs?.Device as string,

		};


		if (!data) {
			toast.error('Error', {
				description: 'File generation failed'
				// action: {
				// 	label: 'Undo',
				// 	onClick: () => console.info('Undo')
				// }
			});
			quickStore.updateLoader(false);
		} else {
			createNewPost(post as Post);
			quickStore.updateLoader(false);
			text = '';

			goto(`/profile/${$store.user?.id}`)
		}
	};

	// $inspect(showInput);
	// Toggle input visibility
	const toggleInput = (): void => {
		showInput = true;
	};

	// Handle clicks outside the input
	const handleClickOutside = (event: MouseEvent): void => {
		const target = event.target as Node;

		if (inputRef && minorInputRef && buttonInputRef) {
			// Check if the click was outside both the button and the input field
			if (!inputRef.contains(target) && !minorInputRef.contains(target) && !buttonInputRef.contains(target)) {

				showInput = false;
			}
		}
	};

	// Attach and clean up event listeners
	$effect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

{#if section == 'body'}
	<form class="relative flex h-12 w-full max-w-6xl items-center">
		<div
			class={` ${showInput ? 'block' : 'hidden'} absolute top-0  w-full bg-white  z-20 py-4 px-3`}
			bind:this={inputRef}
		>
			<Textarea bind:value={text} placeholder="Desribe what you want to see in detail" class="resize-none border-none shadow-none" rows={15}/>


			<div class="flex  justify-end mt-10 h-12">
				<Button
			type="button"
			disabled={$quickStore.isGeneratingFiles}
			{onclick}
			class="h-full text-white  w-full">Generate</Button
		>
			</div>

		</div>
		<input
			type="text"
			bind:value={val}
			bind:this={minorInputRef}
			onclick={toggleInput}
			placeholder="Describe what you want to see"
			class="h-full w-[60%] rounded-none rounded-l-2xl border bg-transparent px-5 outline-none focus:ring-0 md:w-[80%]"
		/>
		<button
			type="button"
			bind:this={buttonInputRef}
			onclick={toggleInput}
			class="h-full w-[40%] rounded-none rounded-r-2xl text-white md:w-[20%] bg-primary">Generate</button
		>
	</form>
{:else}
	<form
		class={`${$page.url.pathname.startsWith('/details') || $page.url.pathname.startsWith('/profile') ? 'flex' : 'hidden'} relative h-12 w-full max-w-6xl items-center`}
	>
		<div
			class={` ${showInput ? 'block' : 'hidden'} absolute top-0  w-full bg-white  z-50 py-4 px-3`}
			bind:this={inputRef}
		>
			<Textarea bind:value={text} placeholder="Desribe what you want to see in detail" class="resize-none border-none shadow-none" rows={15}/>

			<div class="flex justify-end mt-10 h-12">
				<Button
			type="button"
				disabled={$quickStore.isGeneratingFiles}
			{onclick}
			class="h-full   text-white  w-full">Generate</Button
		>
			</div>

		</div>
		<input
			type="text"
			bind:value={val}
			bind:this={minorInputRef}
			onclick={toggleInput}
			placeholder="Describe what you want to see"
			class="h-full w-[60%] rounded-none rounded-l-2xl border bg-transparent px-5 outline-none focus:ring-0 md:w-[80%]"
		/>
		<button
			type="button"
			onclick={toggleInput}
			bind:this={buttonInputRef}
			class="h-full w-[40%] rounded-none rounded-r-2xl text-white md:w-[20%] bg-primary">Generate</button
		>
	</form>
{/if}
