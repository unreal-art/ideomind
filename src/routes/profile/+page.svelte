<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import image1 from '$lib/assets/ima1.jpg';
	import image2 from '$lib/assets/ima2.jpeg';
	import { Ellipsis, Heart, Search, X, CalendarRange, MapPinHouse } from 'lucide-svelte';

	let imgs = [image1, image2];

	let showInput: boolean = $state(false);
	let inputRef: HTMLDivElement | null = $state(null);
	let buttonRef: HTMLDivElement | null = $state(null);

	let isFixed: boolean = $state(false);
	let targetPosition: number = $state(0);
	let targetElement: HTMLElement | null = $state(null);
	let scrollContainer: HTMLElement | null = $state(null);

	// Toggle input visibility
	const toggleInput = (): void => {
		showInput = true;
	};

	// Handle clicks outside the input
	const handleClickOutside = (event: MouseEvent): void => {
		const target = event.target as Node;

		if (inputRef && buttonRef) {
			// Check if the click was outside both the button and the input field
			if (!inputRef.contains(target) && !buttonRef.contains(target)) {
				showInput = false;
			}
		}
	};
	function handleScroll(): void {
		if (!scrollContainer) return;

		// Get the scroll position within the container
		const currentScroll = scrollContainer.scrollTop;

		// Toggle the fixed state based on the current scroll position
		isFixed = currentScroll >= targetPosition;
	}

	// Attach and clean up event listeners
	$effect(() => {
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
	$effect(() => {
		if (targetElement && scrollContainer) {
			// Get the position of the target element relative to the scroll container
			const containerRect = scrollContainer.getBoundingClientRect();
			const targetRect = targetElement.getBoundingClientRect();
			targetPosition = targetRect.top - containerRect.top;
		}

		// Add a scroll listener to the container
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll);
		}
		return () => {
			if (scrollContainer) {
				scrollContainer.removeEventListener('scroll', handleScroll);
			}
		};
	});
</script>

<section bind:this={scrollContainer} class="relative h-full w-full overflow-auto px-2">
	<div
		class=" m-auto flex min-h-[40vh] w-full max-w-[700px] justify-between gap-3 pt-10
		"
	>
		<div class="gap-6 lg:flex">
			<img src={image1} alt="user profile" class="h-32 w-32 rounded-full" />
			<div class="flex flex-col gap-4 px-2 pt-4">
				<div class="">
					<p class="text-md font-semibold">Williamikeji</p>
					<p class="text-sm font-extralight text-gray-500">Chukwunonso Ikeji</p>
				</div>
				<div class="flex gap-6">
					<div class="">
						<p class="text-lg font-semibold">0</p>
						<p class="text-md font-extralight text-gray-500">follower</p>
					</div>
					<div class="">
						<p class="text-lg font-semibold">0</p>
						<p class="text-md font-extralight text-gray-500">following</p>
					</div>
					<div class="">
						<p class="text-lg font-semibold">0</p>
						<p class="text-md font-extralight text-gray-500">like received</p>
					</div>
				</div>
				<div class="">
					<p class="text-md font-semibold">Bio</p>
					<p class="text-md prose font-extralight text-gray-500">I am who I am</p>
				</div>
				<div class="flex gap-4">
					<div class="flex items-center gap-2 font-extralight text-gray-500">
						<CalendarRange size={20} />
						<p class="text-md prose whitespace-nowrap">Joined November 2024</p>
					</div>
					<div class="flex items-center gap-2 font-extralight text-gray-500">
						<MapPinHouse size={20} />
						<p class="text-md prose whitespace-nowrap">Lagos, Nigeria</p>
					</div>
				</div>
			</div>
		</div>
		<Button
			variant="outline"
			class="lg:relatie  absolute right-2 top-10 mt-3 h-10 rounded-md bg-stone-50 text-sm font-extralight"
			>Edit profile</Button
		>
	</div>
	<div class=" relative min-h-[60vh]">
		<Tabs.Root value="public" class="relative h-full w-full">
			<div
				bind:this={targetElement}
				class={`${isFixed ? 'fixed left-0 lg:top-16 ' : ' lg:relative'} top-0 z-20 flex h-12 w-full justify-center bg-stone-50 `}
			>
				<div
					class={` ${showInput ? 'block' : 'hidden'} absolute left-0 top-0 z-20 h-full w-full max-w-[1000px] rounded-2xl border bg-stone-50`}
				>
					<div class="absolute right-0 top-0 flex h-full w-10 items-center justify-center">
						<Button variant="ghost" class="h-full hover:bg-transparent">
							<X size={20} />
						</Button>
					</div>
					<div class="h-full w-full" bind:this={inputRef}>
						<Input
							type="text"
							placeholder="Search prompt"
							class=" h-full w-full rounded-l-2xl  border-none bg-stone-50 pr-10 "
						/>
					</div>
				</div>
				<div class=" relative flex h-full w-full items-center justify-center space-x-1">
					<img
						src={image1}
						alt="user profile"
						class={`${isFixed ? 'block' : 'hidden'} absolute left-2 top-2 h-8 w-8 rounded-full lg:left-28`}
					/>
					<div class="flex h-full items-center" bind:this={buttonRef}>
						<Button onclick={toggleInput} variant="ghost" class="hidden h-full lg:block">
							<Search size={20} />
						</Button>
					</div>
					<Tabs.List class="h-[5%] bg-transparent">
						<Tabs.Trigger value="pinned">Pinned</Tabs.Trigger>
						<Tabs.Trigger value="public">Public</Tabs.Trigger>
						<Tabs.Trigger value="private">Private</Tabs.Trigger>
						<Tabs.Trigger value="liked">Liked</Tabs.Trigger>
					</Tabs.List>
				</div>
			</div>

			<Tabs.Content value="pinned">
				<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
					{#each Array(6) as _, index}
						<div class="relative mb-6 break-inside-avoid">
							<div class="absolute bottom-1 right-0 flex items-center text-white">
								<Button variant="ghost" class><Ellipsis size={20} /></Button>

								<Button variant="ghost" class="flex space-x-2 hover:bg-black/50 hover:text-white">
									<span>2</span>
									<Heart size={20} /></Button
								>
							</div>
							<img src={imgs[(index + 2) % 2]} alt="user profile" class="mb-6 w-full rounded-sm" />
						</div>
					{/each}
				</div>
			</Tabs.Content>
			<Tabs.Content value="public">
				<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
					{#each Array(6) as _, index}
						<div class="relative mb-6 break-inside-avoid">
							<div class="absolute bottom-1 right-0 flex items-center text-white">
								<Button variant="ghost" class><Ellipsis size={20} /></Button>

								<Button variant="ghost" class="flex space-x-2 hover:bg-black/50 hover:text-white">
									<span>2</span>
									<Heart size={20} /></Button
								>
							</div>
							<img src={imgs[(index + 2) % 2]} alt="user profile" class="mb-6 w-full rounded-sm" />
						</div>
					{/each}
				</div>
			</Tabs.Content>
			<Tabs.Content value="private">
				<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
					{#each Array(6) as _, index}
						<div class="relative mb-6 break-inside-avoid">
							<div class="absolute bottom-1 right-0 flex items-center text-white">
								<Button variant="ghost" class><Ellipsis size={20} /></Button>

								<Button variant="ghost" class="flex space-x-2 hover:bg-black/50 hover:text-white">
									<span>2</span>
									<Heart size={20} /></Button
								>
							</div>
							<img src={imgs[(index + 2) % 2]} alt="user profile" class="mb-6 w-full rounded-sm" />
						</div>
					{/each}
				</div>
			</Tabs.Content>

			<Tabs.Content value="liked" class="h-[95%] w-full  ">
				<div class="  columns-1 justify-center gap-4 sm:columns-2 lg:columns-4">
					{#each Array(6) as _, index}
						<div class="relative mb-6 break-inside-avoid">
							<div class="absolute bottom-1 right-0 flex items-center text-white">
								<Button variant="ghost" class><Ellipsis size={20} /></Button>

								<Button variant="ghost" class="flex space-x-2 hover:bg-black/50 hover:text-white">
									<span>2</span>
									<Heart size={20} /></Button
								>
							</div>
							<img src={imgs[(index + 2) % 2]} alt="user profile" class="mb-6 w-full rounded-sm" />
						</div>
					{/each}
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
