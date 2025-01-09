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

		if (error) {
			console.error("Error fetching posts :", error);
			return { posts: [] };
		}

		// Initialize store with the fetched posts
		store.initPosts(posts);

		return { posts: posts || null };
	} catch (err) {
		console.error("Unexpected error:", err);
		return { posts: [] };
	}
};
