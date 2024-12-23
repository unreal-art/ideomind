<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { Heart } from "lucide-svelte";
	import type { Like, Post } from "./types";
	import { store } from "$lib/store";
	import { getPostLikes, likePost } from "./api";

	let { id, post, popLiked }: { id: string; post: Post; popLiked?: (id: string) => void } =
		$props();

	// State management
	let likes = $state<Like[] | null>(null); // Holds all likes for the post
	let liked = $state<boolean>(false); // Whether the current user has liked the post
	let likeCount = $state<number>(0); // Number of likes for the post

	// Function to toggle like status for a post
	const toggleLike = async (item: Post) => {
		if (!$store.user?.id) return; // Ensure user is logged in

		// Optimistically update likeCount and liked status
		if (likeCount !== null) {
			if (liked) {
				if (popLiked) popLiked(id);
			}
			liked ? likeCount-- : likeCount++;
			liked = !liked;
		}

		// Attempt to update the like status on the backend
		const success = await likePost(item.id as string, $store.user?.id);
		if (!success) {
			// Revert optimistic updates on failure
			liked ? likeCount++ : likeCount--;
			liked = !liked;
		} else {
			// Refetch likes to ensure consistency
			await fetchPostLikes(id);
		}
	};

	// Check if the current user has liked the post
	const updateLikedStatus = (likes: Like[]) => {
		liked = likes.some((like) => like.author === $store.user?.id);
	};

	// Fetch likes for the post and update state
	const fetchPostLikes = async (postId: string) => {
		likes = await getPostLikes(postId);

		// Update likeCount and liked status
		likeCount = likes?.length || 0;
		if (likes) updateLikedStatus(likes);
	};

	// Effect to fetch likes when the component mounts or `id` changes
	$effect(() => {
		fetchPostLikes(id);
	});
</script>

<Button
	variant="ghost"
	onclick={() => toggleLike(post)}
	type="button"
	class="flex space-x-2 hover:bg-black/50 hover:text-white"
>
	<span>{likeCount}</span>
	<Heart size={20} class={`${liked ? "fill-pink-500 text-pink-500" : ""}`}></Heart></Button
>
