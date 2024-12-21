// Update the path to your Supabase client
import type { User } from "@/types";
import { supabase } from "../../supabaseClient";
import { authenticate } from "@/api";
import { goto } from "$app/navigation";
import type { LayoutLoad } from "./$types";
import { store } from "$lib/store";

export const load: LayoutLoad = async ({ url }) => {
	try {
		// Fetch posts with likes where author matches the specified value
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
			.eq("author", store.getState().user?.id); // Filter posts by author

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
