// Ensure you have initialized Supabase
import { store } from "@/store";
import { supabase } from "../../supabaseClient";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params }) => {
	try {
		// Extract the slug from the URL
		const slug = params.slug;

		if (!slug) {
			console.error("Slug is missing");
			return { post: null };
		}

		// Fetch the post with the matching slug
		const { data, error } = await supabase
			.from("posts")
			.select(
				`
                *,
                likes (
                    *
                )
            `
			)
			.eq("id", slug) // Assuming `slug` corresponds to the `id` column in the "posts" table
			.single(); // Fetch only a single row

		if (error) {
			console.error("Error fetching post:", error);
			return { data: null };
		}

		store.initPost(data);
		return { data };
	} catch (err) {
		console.error("Unexpected error fetching data:", err);
		return { data: null };
	}
};
