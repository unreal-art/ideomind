// Update the path to your Supabase client
import { supabase } from "../../supabaseClient";
import { authenticate } from "@/api";
import { goto } from "$app/navigation";
import type { LayoutLoad } from "./$types";
import { store } from "$lib/store";

import bluebird from "bluebird";

export const load: LayoutLoad = async ({ url }) => {
	// Get the full URL to pass to `exchangeCodeForSession`
	const fullUrl = url.href;
	console.log(`Loading ${fullUrl}`);

	//fetch post data
	try {
		// Fetch posts with likes
		const { data: posts, error } = await supabase
			.from("posts")
			.select(`*`)
			.order("createdAt", { ascending: false });

		if (error) {
			console.error("Error fetching posts :", error);
			return { posts: [] };
		}

		store.initPosts(posts);

		return { posts: posts || null };
	} catch (err) {
		console.error("Unexpected error:", err);
		return { posts: [] };
	}

	// return { user: userData || null };
};
