// Update the path to your Supabase client
import type { User } from "@/types";
import { supabase } from "../../supabaseClient";
import { authenticate } from "@/api";
import { goto } from "$app/navigation";
import type { LayoutLoad } from "./$types";
import { store } from "$lib/store";

export const load: LayoutLoad = async ({ url }) => {
	try {
		// Fetch posts with likes
		const { data: posts, error } = await supabase
			.from("posts")
			.select("*")
			//@ts-ignore
			.eq("author", store.getState().user.id) // Filter posts by the author_id
			.order("createdAt", { ascending: false }); // Order posts by creation date, descending

		if (error) {
			console.error("Error fetching posts with likes:", error);
			return { posts: [] };
		}

		return { posts: posts || null };
	} catch (err) {
		console.error("Unexpected error:", err);
		return { posts: [] };
	}
};
