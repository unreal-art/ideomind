<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";

	import { Ellipsis, Files } from "lucide-svelte";
	import Separator from "@/components/ui/separator/separator.svelte";
	import { likePost, fetchAuthorOtherPosts, toggleFollow, doesUserFollow } from "@/api";
	import type { Like, Post, UploadResponse } from "@/types";
	import { store } from "$lib/store";

	import { getImageUrl } from "@/api";
	import { formatDistanceToNow } from "date-fns";
	import { copy, type CopyDetail } from "@svelte-put/copy";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";
	import PosterImage from "@/components/PosterImage.svelte";
	import PostAuthor from "@/components/PostAuthor.svelte";
	import Likes from "@/Likes.svelte";
	import DetailList from "@/components/detail/DetailList.svelte";

	let imageUrls = $state([""]);
	let { data }: { data: PageData } = $props();
	let otherPosts: Post[] = $state([]);
	let resolution = $state("");
	let trigger: HTMLButtonElement | undefined = $state(undefined);
	let copied = $state("");
	let fullPrompt = $state(false);
	let fullMagicPrompt = $state(false);
	let post = $state<Post>(data.data as Post);
	let text = $state("");
	let activeFollow = $state<boolean | null>(null);

	$effect(() => {
		if (!$store.isAuthenticated) goto("/");
	});

	$effect(() => {
		text = post.prompt;
	});

	$effect(() => {
		otherPosts = $store.posts;
	});

	$effect(() => {
		//update from store
		post = $store.post;
	});
	$effect(() => {
		fetchAuthorOtherPosts(post?.author, post?.id as string);
	});
	$effect(() => {
		if ($store.user?.id) check();
	});

	async function check() {
		if (!$store.user?.id) return;
		activeFollow = await doesUserFollow($store.user?.id, post.author);
	}

	const like = (item: Post) => {
		if (!$store.user?.id) return;
		likePost(item.id as string, $store.user?.id, "details", post.author, post.id);
	};

	const isInLikedPosts = (likes: any[]): boolean => {
		if (!likes) return false;
		return likes.filter((item) => item.author === $store.user?.id).length > 0;
	};

	const getDate = (date: Date | undefined): string => {
		if (!date) return "";
		const month = date.toLocaleString("default", { month: "short" }); // Get full month name (e.g., 'December')
		const year = date.getFullYear();
		let hour = date.getHours();
		const mins = date.getMinutes().toString().padStart(2, "0"); // Ensure minutes are 2 digits
		const amOrPm = hour >= 12 ? "pm" : "am"; // Determine AM or PM
		hour = hour % 12 || 12; // Convert to 12-hour format, adjust for 0 to 12

		return `${month} ${year} at ${hour}:${mins} ${amOrPm}`;
	};

	const getImages = async (imgs: UploadResponse[]) => {
		imageUrls = imgs.map(item => import.meta.env.VITE_LIGHTHOUSE_GATE_WAY +  item.hash +'/' + item.fileNames[0])

	};

	const getImageResolution = async (url: string) => {
		const img = new Image();
		return new Promise((resolve, reject) => {
			img.onload = () => resolve({ width: img.width, height: img.height });
			img.onerror = () => reject(new Error("Failed to load image"));
			img.src = url; // Start loading the image
		});
	};

	function handleCopied(e: CustomEvent<CopyDetail>) {
		copied = e.detail.text;
		toast("Copied", {
			description: ""
		});
	}

	const handleFollow = async () => {
		if (!$store.user?.id) return;
		//hide button
		activeFollow = null;
		await toggleFollow($store.user?.id, post.author);
		check();
	};

	function handleImageError(event: Event) {
		const target = event.target as HTMLImageElement;
		target.src = "";
		// Stop loading indicator
	}

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
			{#if !imageUrls[0]}
				<div class="flex h-[90vh] w-full items-center justify-center bg-gray-100">
					<div class="flex items-center space-x-2">
						<div
							class="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"
						></div>
						<span class="font-medium text-gray-600">Loading...</span>
					</div>
				</div>
			{:else}
				<img src={imageUrls[0]} alt="view" onerror={handleImageError} class=" max-h-[92vh]" />
			{/if}
		</div>
		<div
			class="flex h-full flex-col gap-5 overflow-y-scroll rounded-md border bg-white dark:bg-secondary px-2 py-4 shadow lg:w-[25%]"
		>
			<!-- user details -->
			<div class="mt-3 flex h-10 w-full justify-between">
				<div class="relative flex h-full space-x-2">
					<PosterImage authorId={post?.author} />
					<div class=" flex flex-col">
						<PostAuthor authorId={post?.author} />
						{#if post?.createdAt}
							<p class="text-light text-sm text-gray-400">
								{formatDistanceToNow(post?.createdAt)} ago
							</p>
						{/if}
					</div>
				</div>
				{#if activeFollow != null && !activeFollow}
					<Button
						onclick={handleFollow}
						class="h-fit w-fit rounded-full bg-red-500 p-1   px-2 text-xs">follow</Button
					>
				{/if}
				{#if activeFollow != null && activeFollow}
					<Button onclick={handleFollow} class="h-fit w-fit rounded-full  p-1   px-2 text-xs"
						>unfollow</Button
					>
				{/if}

				<div class="flex items-center">
					<Button variant="ghost"><Ellipsis size={20} /></Button>
					<Likes id={post.id} {post} />
				</div>
			</div>

			<!-- image list -->
			<div class="flex h-28 gap-3 overflow-x-auto">
				{#each imageUrls as img}
					{#if !img}
						<div class="flex h-full w-[25%] items-center justify-center bg-gray-100">
							<div class="flex items-center space-x-2">
								<div
									class="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary"
								></div>
								<span class="font-medium text-gray-600"></span>
							</div>
						</div>
					{:else}
						<div class="h-full w-[25%] opacity-40">
							<img
								src={img}
								alt="view"
								onerror={handleImageError}
								class=" h-full w-full rounded-md"
							/>
						</div>
					{/if}
				{/each}
			</div>

			<Separator />

			<!-- prompt -->

			<div class="flex flex-col gap-2">
				<div class="flex h-12 w-full items-center justify-between">
					<p class="font-semibold">Prompt</p>
					<div class="flex h-full items-center gap-3">
						<!-- <button class="rounded border p-2 text-gray-500 hover:bg-secondary">
							<Plus size={20} />
						</button> -->
						<button
							class="rounded-sm border p-2 text-gray-500  hover:bg-secondary"
							bind:this={trigger}
						>
							<Files size={20} />
						</button>
					</div>
				</div>
				<p class="prose dark:text-gray-300" use:copy={{ trigger }} oncopied={handleCopied}>
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
					<p class="font-extralight text-gray-500">{getDate(new Date(post?.createdAt))}</p>
				</div>
			</div>
		</div>
	</section>

	<!-- More from user -->
	<div class="my-10 flex h-12 w-full items-center justify-center space-x-3">
		<p>More from</p>

		<div class="h-10 w-10">
			<PosterImage authorId={post?.author} />
		</div>
		<PostAuthor authorId={post?.author} />
	</div>

	<!-- image list -->

	<DetailList data={otherPosts} />
</section>
