<script lang="ts">
	import { Bell, House, Menu, Plus, GalleryVertical } from 'lucide-svelte';
	import Button from '@/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="absolute bottom-0 h-20 w-full bg-stone-50 lg:hidden">
	<div
		class="before:absolute before:left-0 before:top-0 before:h-2 before:w-full before:bg-transparent before:shadow-md"
	></div>
	<div class="flex h-full w-full items-center justify-center gap-12 pt-2">
		<House size={20} />
		<GalleryVertical size={20} />
		<Button class="h-12 w-12 rounded-full p-0 ">
			<Plus size={30} />
		</Button>
		<div class="relative">
			<Badge variant="destructive" class="absolute -right-4 -top-4  rounded-full">10</Badge>
			<Bell size={20} />
		</div>
		<Menu size={20} />
	</div>
</section>
