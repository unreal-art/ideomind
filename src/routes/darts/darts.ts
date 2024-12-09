import { PinataSDK } from 'pinata';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs/promises';

const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT!,
	pinataGateway: 'example-gateway.mypinata.cloud'
});

export async function uploadImage(generatedImagePath: string) {
	try {
		// Read the file
		const buffer = await fs.readFile(generatedImagePath);

		// Determine the MIME type from the file extension
		const mimeType = mime.lookup(generatedImagePath) || 'application/octet-stream';

		// Generate a unique name for the file
		const uniqueName = `${uuidv4()}${path.extname(generatedImagePath)}`;

		// Create a File-like object for the image
		const file = new File([buffer], uniqueName, { type: mimeType });

		// Upload the file to Pinata
		const upload = await pinata.upload.file(file);
		console.log('Upload response:', upload);
	} catch (error) {
		console.log(error);
	}
}

// Extract the location URL from the output
export function extractLocationURL(output: string): string | null {
	const regex = /open\s+(.*)\s+cat\s+.*\s+cat\s+.*\s+(https?:\/\/\S+)/;
	const match = output.match(regex);
	return match ? match[1] : null;
}
