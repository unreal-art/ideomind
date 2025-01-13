import { supabase } from "../../supabaseClient";
import type { LayoutLoad } from "./$types";
import { store } from "$lib/store";

export const load: LayoutLoad = async ({ url }) => {
	// Get the full URL to pass to `exchangeCodeForSession`
	const fullUrl = url.href;
	console.log(`Loading ${fullUrl}`);

	try {
		// Fetch the first 10 posts
		const { data: posts, error } = await supabase
			.from("posts")
			.select("*")
			.order("createdAt", { ascending: false })
			.range(0, 9); // Fetch posts 0-9 (10 posts total)

		// Fetch the post with the highest like_count
		const { data: topPosts, error: topPostError } = await supabase
			.from("posts")
			.select("*")
			.order("like_count", { ascending: false })
			.range(0, 9);

		if (error || topPostError) {
			console.error("Error fetching posts or top post:", error || topPostError);
			return { posts: [], topPosts: null };
		}

		// Initialize store with the fetched posts
		store.initPosts(posts);
		// Return the posts and the top post with the highest likes
		return { posts: posts || null, topPosts: topPosts || null };
	} catch (err) {
		console.error("Unexpected error:", err);
		return { posts: [], topPosts: null };
	}
};
