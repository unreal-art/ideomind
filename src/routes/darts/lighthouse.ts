import lighthouse from '@lighthouse-web3/sdk'
import path from 'path';
import fs from 'fs/promises';
import { LIGHTHOUSE_KEY } from "$env/static/private";

export interface UploadResponse {
  name: string;
  hash: string;
  size: string;
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

        // Upload the file to Lighthouse
        const {data} = await lighthouse.upload(filePath, LIGHTHOUSE_KEY);
        console.log(`Upload response for ${fileName}:`, data);

        uploadResults.push({
          name: data.Name,
          hash: data.Hash,
          size: data.Size
        });
      }
    }

    return uploadResults;
  } catch (error) {
    // Type narrowing for error object
    if (error instanceof Error) {
      console.error('Error uploading file:', {
        message: error.message,
        stack: error.stack,
        directoryPath
      });

      throw new Error(
        `Failed to upload file. Ensure the file at "${directoryPath}" exists and try again.`
      );
    } else {
      console.error('Unexpected error uploading file:', error);
      throw new Error('An unexpected error occurred during the upload process.');
    }
  }
}
