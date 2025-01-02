import lighthouse from "@lighthouse-web3/sdk";
import path from "path";
import fs from "fs/promises";
import { LIGHTHOUSE_KEY as LH_KEY } from "$env/static/private";
import { genLhApiKey } from "@utils/lh";

let LIGHTHOUSE_KEY = LH_KEY;

try {
	const lhApiKey = await genLhApiKey();
	console.log("generated key", lhApiKey);
	LIGHTHOUSE_KEY = lhApiKey;
} catch (e) {
	console.error("failed to genr", e);
}

export interface UploadResponse {
	name: string;
	hash: string;
	size: string;
	fileNames: string[];
}

// Callback to track upload progress
const progressCallback = (progressData: { total: number; uploaded: number }) => {
	const percentageDone = (100 - (progressData.total / progressData.uploaded) * 100).toFixed(2);
	console.log(`Upload Progress: ${percentageDone}%`);
};

/**
 * Upload all files in the 'outputs' subdirectory to Lighthouse
 * @param directoryPath - Path to the main directory containing the 'outputs' subdirectory
 * @returns An array of upload results
 */
export async function uploadFilesInOutputs(directoryPath: string): Promise<UploadResponse[]> {
	console.log("Lighthouse Key", LIGHTHOUSE_KEY);
	try {
		// Resolve the 'outputs' directory path
		const outputsPath = path.join(directoryPath, "outputs");

		// Check if the 'outputs' directory exists
		const stats = await fs.stat(outputsPath);
		if (!stats.isDirectory()) {
			throw new Error(`The 'outputs' directory does not exist at: ${outputsPath}`);
		}

		// Read all files in the 'outputs' directory
		const fileNames = await fs.readdir(outputsPath);
		if (fileNames.length === 0) {
			throw new Error(`No files found in the 'outputs' directory at: ${outputsPath}`);
		}

		// Upload the directory to Lighthouse
		//@ts-ignore
		const { data } = await lighthouse.upload(outputsPath, LIGHTHOUSE_KEY, true, progressCallback);

		console.log(`Upload successful for ${outputsPath}:`, data);

		// Prepare the upload result
		const uploadResults: UploadResponse[] = [
			{
				name: data.Name,
				hash: data.Hash,
				size: data.Size,
				fileNames
			}
		];

		return uploadResults;
	} catch (error) {
		// Handle and log errors
		if (error instanceof Error) {
			console.error("Error during upload:", {
				message: error.message,
				stack: error.stack,
				directoryPath
			});
			throw new Error(`Upload failed: ${error.message}`);
		} else {
			console.error("Unexpected error during upload:", error);
			throw new Error("An unknown error occurred during the upload process.");
		}
	}
}
