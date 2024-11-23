<script lang="ts">
	import pic from '$lib/assets/ima1.jpg';
	import Button from '@/components/ui/button/button.svelte';
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="flex h-3/4 w-[90%] max-w-[400px] flex-col gap-3">
		<div class="flex w-full items-center space-x-3 text-xl font-semibold">Gengram</div>

		<!-- <enhanced:img src={img} alt="landing page image  " /> -->
		<img src={pic} alt="home page" class=" h-[400px] w-[400px] rounded-md" />

		<div class="h-[10%] w-full text-center">
			<a href="explore"><Button class="text-md h-12 w-full">Get Started</Button></a>
		</div>
	</div>
</main>
