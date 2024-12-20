<script lang="ts">
	import { getPostUserName } from "@/api";

	let { authorId } = $props();
	let name: string | null = $state(null);

	$effect(() => {
		async function getData() {
			name = await getPostUserName(authorId);
		}
		getData();
	});
</script>

<p class="text-sm">{name}</p>
