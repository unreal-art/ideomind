import type { Post, UploadResponse } from "@/types";
import { supabase } from "../../supabaseClient";
import type { JobSpec } from "./darts";

// function formatText(input: string): string {
// 	// Replace all spaces with '-'
// 	const formattedText = input.replace(/\s+/g, '-');
// 	// Append '.png' at the end
// 	return `${formattedText}.png`;
// }
//post to db
export const postDataToDb = async (post: Post) => {
	try {
		const { data, error } = await supabase.from("posts").insert([post]);

		if (error) {
			throw new Error(`Error inserting data: ${error.message}`);
		}

		return data; // Return data if needed
	} catch (err) {
		console.error("Failed to insert data into posts table:", err);
		throw err; // Optionally re-throw the error if the caller needs to handle it
	}
};
