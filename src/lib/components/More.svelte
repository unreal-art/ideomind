<script lang="ts">
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Button from './ui/button/button.svelte';
	import {
		Ellipsis,
		FileCog,
		ImageDown,
		ImageUpscale,
		MonitorCog,
		NotepadTextDashed,
		Pin,
		RotateCcw,
		RotateCw
	} from 'lucide-svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		><Button variant="ghost" class="hover:bg-black/50 hover:text-white"
			><Ellipsis size={20} /></Button
		></DropdownMenu.Trigger
	>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.Group>
				<DropdownMenu.Item class="cursor-pointer">
					<RotateCw class="mr-2 size-4" />
					<span>Retry</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer">
					<FileCog class="mr-2 size-4" />
					<span>Remix</span>
				</DropdownMenu.Item>
				<DropdownMenu.Item class="cursor-pointer">
					<ImageUpscale class="mr-2 size-4" />
					<span>Upscale</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger class="cursor-pointer">
						<ImageDown class="mr-2 size-4" />
						<span>Download</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item class="cursor-pointer">
							PNG
							<span class="font-extralight"> (100% quality)</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item class="cursor-pointer">
							JPEG
							<span class="font-extralight"> (70% quality)</span>
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="cursor-pointer">
				<MonitorCog class="mr-2 size-4" />
				<span>Edit in Editor</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item class="cursor-pointer">
				<LifeBuoy class="mr-2 size-4" />
				<span>Use Prompt</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item class="cursor-pointer">
				<NotepadTextDashed class="mr-2 size-4" />
				<span>Describe</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="cursor-pointer">
				<Pin class="mr-2 size-4" />
				<span>Pin</span>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
