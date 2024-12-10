import { PinataSDK } from 'pinata';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs/promises';
import { PINATA_GATEWAY, PINATA_JWT } from '$env/static/private';

const pinata = new PinataSDK({
	pinataJwt: PINATA_JWT,
	pinataGateway: PINATA_GATEWAY || 'tan-neighbouring-scallop-560.mypinata.cloud'
});

export interface UploadResponse {
	id: string;
	name: string;
	cid: string;
	created_at: string;
	size: number;
	number_of_files: number;
	mime_type: string;
	user_id: string;
}

export async function uploadFilesInOutputs(directoryPath: string): Promise<UploadResponse[]> {
	try {
		// Path to the 'outputs' subdirectory
		const outputsPath = path.join(directoryPath, 'outputs');

		// Check if the 'outputs' directory exists
		const stats = await fs.stat(outputsPath);
		if (!stats.isDirectory()) {
			throw new Error(`The 'outputs' directory does not exist in: ${directoryPath}`);
		}

		// Read the contents of the 'outputs' directory
		const files = await fs.readdir(outputsPath);

		// Array to store upload results
		const uploadResults: UploadResponse[] = [];

		for (const fileName of files) {
			const filePath = path.join(outputsPath, fileName);

			// Check if it's a file
			const fileStats = await fs.stat(filePath);
			if (fileStats.isFile()) {
				// Read the file
				const buffer = await fs.readFile(filePath);

				// Determine the MIME type
				const mimeType = mime.lookup(filePath) || 'application/octet-stream';

				// Generate a unique name for the file
				const uniqueName = `${uuidv4()}${path.extname(filePath)}`;

				// Create a File-like object
				const file = new File([buffer], uniqueName, { type: mimeType });

				// Upload the file to Pinata
				const upload: UploadResponse = await pinata.upload.file(file);
				console.log(`Upload response for ${fileName}:`, upload);

				uploadResults.push(upload);
			}
		}

		return uploadResults;
	} catch (error) {
		// Type narrowing for error object
		if (error instanceof Error) {
			// Log the error details for debugging
			console.error('Error uploading image:', {
				message: error.message,
				stack: error.stack,
				directoryPath
			});

			// Rethrow a user-friendly error
			throw new Error(
				`Failed to upload image. Ensure the file at "${directoryPath}" exists and try again.`
			);
		} else {
			// Handle non-Error exceptions
			console.error('Unexpected error uploading image:', error);
			throw new Error('An unexpected error occurred during the upload process.');
		}
	}
}
