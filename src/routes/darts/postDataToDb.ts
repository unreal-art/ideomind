import type { Post, UploadResponse } from "@/types";

import type { JobSpec } from "./darts";

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from "$env/static/private";

const supabaseUrl = PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;
const private_SRK = PRIVATE_SUPABASE_SERVICE_ROLE_KEY;

export const secretSupabaseClient: SupabaseClient = createClient(supabaseUrl, private_SRK);

// function formatText(input: string): string {
// 	// Replace all spaces with '-'
// 	const formattedText = input.replace(/\s+/g, '-');
// 	// Append '.png' at the end
// 	return `${formattedText}.png`;
// }
//post to db
export const postDataToDb = async (post: Partial<Post>) => {
	try {
		// Ensure `author` is present in the post object
		if (!post.author) {
			throw new Error("Author is required to insert a post.");
		}

		// Call the Supabase RPC function
		const { data, error } = await secretSupabaseClient.from("posts").insert({
			author: post.author,
			isPrivate: false,
			prompt: post.prompt,
			isPinned: post.isPinned,
			category: post.category,
			ipfsImages: post.ipfsImages,
			cpu: post.cpu,
			device: post.device
		});

		if (error) {
			throw new Error(`Error inserting data: ${error.message}`);
		}

		console.log(data, error);
		return data; // Return data if needed
	} catch (err) {
		console.error("Failed to insert data into posts table:", err);
		throw err;
	}
};
