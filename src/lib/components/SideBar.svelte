<script lang="ts">
	import Button from './ui/button/button.svelte';
	import { Bell, GalleryVertical, House, Menu, BrainCircuit } from 'lucide-svelte';
	import profileImage from '$lib/assets/ima1.jpg';
</script>

<aside class="hidden h-full w-[5%] min-w-[100px] border-r px-2 py-2 lg:block">
	<div class="flex h-[50%] w-full flex-col gap-4">
		<div class="flex h-16 w-full items-center justify-center">
			<BrainCircuit size={30} />
		</div>
		<a href="/explore">
			<Button
				class="flex h-16 w-full flex-col justify-center gap-2 bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-black"
				><House size={20} />
				<span class="text-xs">Home</span>
			</Button>
		</a>
		<a href="/creations">
			<Button
				class="flex h-16  w-full flex-col justify-center gap-2 bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-black"
				><GalleryVertical size={20} />

				<span class=" text-xs">Creations</span>
			</Button>
		</a>
	</div>
	<div class="flex h-[50%] w-full flex-col justify-end gap-4">
		<Button variant="ghost" class="h-16 w-full"><Bell size={22} /></Button>
		<Button variant="ghost" class="h-16 w-full">
			<img src={profileImage} alt="user profile" class="rounded-full" />
		</Button>
		<Button variant="ghost" class="h-16 w-full"><Menu size={22} /></Button>
	</div>
</aside>
