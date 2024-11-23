<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import image1 from '$lib/assets/ima1.jpg';
	import image2 from '$lib/assets/ima2.jpeg';
	import { Ellipsis, Heart } from 'lucide-svelte';

	let imgs = [image1, image2];
</script>

<section class="h-full w-full overflow-auto px-2">
	<div class="flex h-[20%] flex-col items-center justify-center gap-3">
		<h2 class="text-4xl font-semibold">Unleash your creative juice</h2>
		<form class="flex h-12 w-full max-w-6xl items-center">
			<Input
				type="email"
				placeholder="Describe what you want to see"
				class="h-full w-[80%] rounded-none rounded-l-2xl"
			/>
			<Button type="submit" class="ext-white h-full w-[20%] rounded-none rounded-r-2xl"
				>Generate</Button
			>
		</form>
	</div>
	<div class="h-[79%]">
		<Tabs.Root value="explore" class="h-full w-full">
			<Tabs.List class="h-[5%] bg-transparent">
				<Tabs.Trigger value="explore">Explore</Tabs.Trigger>
				<Tabs.Trigger value="following">Following</Tabs.Trigger>
				<Tabs.Trigger value="top">Top</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="explore" class="h-[95%] w-full  ">
				<div class="   h-full w-full columns-1 gap-4 overflow-y-auto sm:columns-2 lg:columns-4">
					{#each Array(6) as _, index}
						<div class="mb-6 break-inside-avoid">
							<img
								src={imgs[index % 2]}
								alt="user profile"
								class="aspect-square w-full rounded-sm"
							/>
							<div class="mt-3 flex h-10 w-full items-center justify-between">
								<div class="flex h-full space-x-2">
									<img src={image1} alt="user profile" class="h-full rounded-full" />
									<div class="flex flex-col">
										<p class="text-sm">Codypharm</p>
										<p class="text-light text-sm text-gray-400">11min ago</p>
									</div>
								</div>
								<div class="flex items-center">
									<Button variant="ghost"><Ellipsis size={20} /></Button>
									<p class="text-light text-sm">2</p>
									<Button variant="ghost"><Heart size={20} /></Button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</Tabs.Content>
			<Tabs.Content value="following">Change your password here.</Tabs.Content>
			<Tabs.Content value="top">Change your password here.</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
