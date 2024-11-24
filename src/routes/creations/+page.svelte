<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import image1 from '$lib/assets/ima1.jpg';
	import image2 from '$lib/assets/ima2.jpeg';
	import { Ellipsis, Heart, Search, X, ListFilter } from 'lucide-svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	let imgs = [image1, image2];
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	const choices = [
		{ value: 'everything', label: 'Everything' },
		{ value: 'generations', label: 'Generations' },
		{ value: 'edits', label: 'Edits' },
		{ value: 'uploads', label: 'Uploads' },
		{ value: 'upscales', label: 'Upscales' }
	];
	let selectedChoice = $state('');

	const triggerContent = $derived(
		choices.find((f) => f.value === selectedChoice)?.label ?? 'Filter'
	);

	let showInput: boolean = $state(false);
	let inputRef: HTMLDivElement | null = $state(null);
	let buttonRef: HTMLDivElement | null = $state(null);

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

	// Attach and clean up event listeners
	$effect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<section class="h-full w-full overflow-auto px-2">
	<div class="hidden h-[20%] flex-col items-center justify-center gap-3 lg:flex">
		<h2 class="text-sm font-semibold md:text-2xl lg:text-4xl">Unleash your creative juice</h2>
		<form class="flex h-12 w-full max-w-6xl items-center">
			<Input
				type="text"
				placeholder="Describe what you want to see"
				class="h-full w-[60%] rounded-none rounded-l-2xl md:w-[80%]"
			/>
			<Button type="submit" class="h-full w-[40%] rounded-none rounded-r-2xl text-white md:w-[20%]"
				>Generate</Button
			>
		</form>
	</div>
	<div class="h-full lg:h-[79%]">
		<Tabs.Root value="all" class="h-full w-full">
			<div class="fixed top-0 z-50 flex h-12 w-full justify-between bg-stone-50 lg:relative">
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
							placeholder="Search your creations"
							class=" h-full w-full rounded-l-2xl  border-none bg-stone-50 pr-10 "
						/>
					</div>
				</div>
				<div class=" flex h-full items-center space-x-1">
					<div class="flex h-full items-center" bind:this={buttonRef}>
						<Button onclick={toggleInput} variant="ghost" class="h-full">
							<Search size={20} />
						</Button>
					</div>
					<Tabs.List class="h-[5%] bg-transparent">
						<Tabs.Trigger value="all">All</Tabs.Trigger>
						<Tabs.Trigger value="pinned">Pinned</Tabs.Trigger>
						<Tabs.Trigger value="public">Public</Tabs.Trigger>
						<Tabs.Trigger value="private">Private</Tabs.Trigger>
					</Tabs.List>

					<div class="flex h-full items-center lg:hidden">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost' })}>
								<ListFilter size={20} /></DropdownMenu.Trigger
							>
							<DropdownMenu.Content class="w-56">
								<DropdownMenu.Group>
									<DropdownMenu.GroupHeading>Filter</DropdownMenu.GroupHeading>
									<DropdownMenu.Separator />
									<DropdownMenu.RadioGroup bind:value={selectedChoice}>
										{#each choices as choice}
											<DropdownMenu.RadioItem value={choice.value}
												>{choice.label}</DropdownMenu.RadioItem
											>
										{/each}
									</DropdownMenu.RadioGroup>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
				<div class="hidden h-full lg:block">
					<Select.Root type="single" name="choice" bind:value={selectedChoice}>
						<Select.Trigger class="w-[180px]">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.GroupHeading>Filter</Select.GroupHeading>
								{#each choices as choice}
									<Select.Item value={choice.value} label={choice.label}>{choice.label}</Select.Item
									>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<Tabs.Content value="all" class="h-[95%] w-full  ">
				<div class="  columns-1 justify-center gap-8 sm:columns-2 lg:columns-4">
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
			<Tabs.Content value="pinned">
				<div class="  columns-1 justify-center gap-8 sm:columns-2 lg:columns-4">
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
				<div class="  columns-1 justify-center gap-8 sm:columns-2 lg:columns-4">
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
				<div class="  columns-1 justify-center gap-8 sm:columns-2 lg:columns-4">
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
