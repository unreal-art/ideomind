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
		const { data, error } = await secretSupabaseClient.from("posts").insert([post]).select("*");

		if (error) {
			throw new Error(`Error inserting data: ${error.message}`);
		}

		console.log(data, error);
		return data; // Return data if needed
	} catch (err) {
		console.error("Failed to insert data into posts table:", err);
		throw err; // Optionally re-throw the error if the caller needs to handle it
	}
};
