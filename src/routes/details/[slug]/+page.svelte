<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import image1 from '$lib/assets/ima1.jpg';
	import image2 from '$lib/assets/ima2.jpeg';
	import { Ellipsis, Heart, Files, Plus } from 'lucide-svelte';

	let imgs = [image1, image2];
	import Separator from '@/components/ui/separator/separator.svelte';
	let fullPrompt = $state(false);
	let fullMagicPrompt = $state(false);
	let text = $state(
		"Imagine a Pixar Disney studio 3D style caricature of a black man wearing a red and white horizontally striped tank top, white straight-cut elegant light fabric pants, and a short-brim Panama-style white hat slightly tilted forward. The man holds the brim of the hat with his right hand, emphasizing a traditional samba or dance gesture, while his body leans slightly forward, with his left leg advanced and the right leg back, capturing a dance movement with relaxed shoulders. Vibrant green and yellow lighting reflects off the white pants, evoking a lively concert or party atmosphere. The outfit and posture embody the classic samba singer's elegance and fluidity in motion."
	);
</script>

<section class="relative h-full w-full overflow-y-auto px-2">
	<section class="min-h-[92vh] w-full lg:flex">
		<div class="flex h-full items-center justify-center lg:w-[75%]">
			<img src={image2} alt="view" class=" max-h-[92vh]" />
		</div>
		<div
			class="flex h-full flex-col gap-5 overflow-y-scroll rounded-md border bg-white px-2 py-4 shadow lg:w-[25%]"
		>
			<!-- user details -->
			<div class="mt-3 flex h-10 w-full justify-between">
				<div class="relative flex h-full space-x-2">
					<img src={image1} alt="user profile" class="h-full rounded-full" />
					<div class=" flex flex-col">
						<p class="text-sm">Codypharm</p>
						<p class="text-light text-sm text-gray-400">11min ago</p>
					</div>
				</div>
				<Button class="h-fit w-fit rounded-full bg-red-500 p-1   px-2 text-xs">follow</Button>
				<div class="flex items-center">
					<Button variant="ghost"><Ellipsis size={20} /></Button>
					<p class="text-light text-sm">2</p>
					<Button variant="ghost"><Heart size={20} /></Button>
				</div>
			</div>

			<!-- image list -->
			<div class="flex h-28 gap-3 overflow-x-auto">
				<div class="h-full w-[25%] opacity-40">
					<img src={image2} alt="view" class=" h-full w-full rounded-md" />
				</div>
				<div class="h-full w-[25%]">
					<img src={image2} alt="view" class=" h-full w-full rounded-md" />
				</div>
				<div class="h-full w-[25%] opacity-40">
					<img src={image2} alt="view" class=" h-full w-full rounded-md" />
				</div>
				<div class="h-full w-[25%] opacity-40">
					<img src={image2} alt="view" class=" h-full w-full rounded-md" />
				</div>
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
					{/if}
				</p>
			</div>

			<Separator />

			<!--magic prompt -->
			<div class="flex flex-col gap-2">
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
					{/if}
				</p>
			</div>

			<Separator />

			<!--other info -->

			<div class="grid grid-cols-2 gap-3">
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Prompt</p>
					<p class="font-extralight text-gray-500">Ideomind 1.0</p>
				</div>
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Style</p>
					<p class="font-extralight text-gray-500">3D</p>
				</div>
				<div class=" col-span-1 space-y-3">
					<p class="font-semibold">Resolution</p>
					<p class="font-extralight text-gray-500">9:16 (736 x 1312)</p>
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
					<p class="font-extralight text-gray-500">Nov 24, 2024, 3:01 PM</p>
				</div>
			</div>
		</div>
	</section>

	<!-- More from user -->
	<div class="my-10 flex h-12 w-full items-center justify-center space-x-3">
		<p>More from</p>

		<img src={image1} alt="user profile" class="h-full rounded-full" />
		<p>Codypharm</p>
	</div>

	<!-- image list -->

	<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
		{#each Array(6) as _, index}
			<div class="mb-6 break-inside-avoid">
				<img src={imgs[(index + 2) % 2]} alt="user profile" class="mb-6 w-full rounded-sm" />
				<div class="mt-3 flex h-10 w-full items-center justify-end">
					<Button variant="ghost"><Ellipsis size={20} /></Button>
					<p class="text-light text-sm">2</p>
					<Button variant="ghost"><Heart size={20} /></Button>
				</div>
			</div>
		{/each}
	</div>
</section>
