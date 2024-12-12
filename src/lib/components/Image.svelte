<script lang="ts">
	import { getImageUrl } from '@/api';
	let { item } = $props();
	let imageUrl = $state('');
	const getImage = async (cid: any) => {
		imageUrl = (await getImageUrl(cid)) as string;
	};

	$effect(() => {
		getImage(item.ipfsImages[0].cid);
	});
</script>

<a href={`/details/${item.id}`}>
	<img src={imageUrl} alt="user profile" class="mb-6 w-full rounded-sm" />
</a>
