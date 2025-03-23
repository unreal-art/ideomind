import fs from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";
import crypto from "crypto";

import {
	CLOUDFLARE_R2_BUCKET_NAME,
	CLOUDFLARE_ACCOUNT_ID,
	CLOUDFLARE_R2_ENDPOINT,
	CLOUDFLARE_R2_ACCESS_KEY_ID,
	CLOUDFLARE_R2_SECRET_ACCESS_KEY
} from "$env/static/private";

const s3Client = new S3Client({
	region: "auto",
	endpoint: CLOUDFLARE_R2_ENDPOINT,
	credentials: {
		accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
		secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY
	}
});

export interface UploadResponse {
	name: string;
	hash: string;
	size: string;
	fileNames: string[];
}

export async function uploadFilesInOutputs(
	userUUID: string,
	directoryPath: string
): Promise<UploadResponse[]> {
	try {
		const outputsPath = path.join(directoryPath, "outputs");

		// Check if 'outputs' directory exists
		const stats = await fs.stat(outputsPath);
		if (!stats.isDirectory()) {
			throw new Error(`The 'outputs' directory does not exist at: ${outputsPath}`);
		}

		// Read files from 'outputs'
		const fileNames = await fs.readdir(outputsPath);
		if (fileNames.length === 0) {
			throw new Error(`No files found in the 'outputs' directory at: ${outputsPath}`);
		}

		// Upload files to Cloudflare R2
		const uploadResults = await Promise.all(
			fileNames.map(async (fileName) => {
				const filePath = path.join(outputsPath, fileName);
				const fileBuffer = await fs.readFile(filePath);

				// Detect file type
				const detectedType = await fileTypeFromBuffer(fileBuffer);
				if (!detectedType) {
					console.warn(`Skipping unknown file type: ${fileName}`);
					return null;
				}

				const { ext, mime } = detectedType;
				const randomSuffix = crypto.randomUUID().slice(0, 8); // Generate a short random string
				const newFileName = `${path.basename(fileName, path.extname(fileName))}-${randomSuffix}.${ext}`;
				const objectKey = `${userUUID}/${newFileName}`;

				console.log(`Uploading ${fileName} as ${newFileName} with MIME type ${mime}`);

				// Upload file to Cloudflare R2
				await s3Client.send(
					new PutObjectCommand({
						Bucket: CLOUDFLARE_R2_BUCKET_NAME,
						Key: objectKey,
						Body: fileBuffer,
						ContentType: mime
					})
				);

				// Get file size
				const { size } = await fs.stat(filePath);

				return {
					name: newFileName,
					hash: `https://${CLOUDFLARE_R2_BUCKET_NAME}.${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${objectKey}`,
					size: size.toString(),
					fileNames: [newFileName]
				} as UploadResponse;
			})
		);

		// Remove `null` values
		const validUploads: UploadResponse[] = uploadResults.filter(
			(upload): upload is UploadResponse => upload !== null
		);

		console.log("Upload successful:", validUploads);
		return validUploads;
	} catch (error) {
		console.error("Error during upload:", error);
		throw new Error("Upload failed.");
	}
}
