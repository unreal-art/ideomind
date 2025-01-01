import type { UploadResponse } from "@/types";
import { supabase } from "../../supabaseClient";
import type { JobSpec } from "./darts";

// function formatText(input: string): string {
// 	// Replace all spaces with '-'
// 	const formattedText = input.replace(/\s+/g, '-');
// 	// Append '.png' at the end
// 	return `${formattedText}.png`;
// }
//post to db
export const postDataToDb = async (uploadResponse: UploadResponse[], dto: JobSpec) => {
	try {
		const { data, error } = await supabase.from("posts").insert([
			{
				author: dto.author,
				isPrivate: dto.isPrivate,
				prompt: dto.inputs?.Prompt,
				isPinned: dto.isPinned,
				category: dto.category,
				ipfsImages: uploadResponse,
				cpu: dto.inputs?.cpu,
				device: dto.inputs?.Device,
				seed: dto.inputs?.Seed,
				n: dto.inputs?.N
			}
		]);

		if (error) {
			throw new Error(`Error inserting data: ${error.message}`);
		}

		return data; // Return data if needed
	} catch (err) {
		console.error("Failed to insert data into posts table:", err);
		throw err; // Optionally re-throw the error if the caller needs to handle it
	}
};
