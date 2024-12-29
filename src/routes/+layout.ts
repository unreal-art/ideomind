// Update the path to your Supabase client
import type { User } from "@/types";
import { supabase } from "../supabaseClient";
import { authenticate } from "@/api";
import { goto } from "$app/navigation";
import type { LayoutLoad } from "./$types";
import { store } from "$lib/store";

export const load: LayoutLoad = async ({ url }) => {
	//fetch post data
	try {
		// Fetch posts with likes
		const { data: posts, error } = await supabase
			.from("posts")
			.select(
				`
        *,
        likes (
          *
        )
      `
			)
			.limit(10);

		if (error) {
			console.error("Error fetching posts with likes:", error);
			return { posts: [] };
		}

		store.initPosts(posts);
	} catch (err) {
		console.error("Unexpected error:", err);
		return { posts: [] };
	}
};
