import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { json, type RequestHandler } from '@sveltejs/kit';
import { extractLocationURL } from './darts';
import { DEBUG } from '$env/static/private';
import { dev } from '$app/environment';

import { DARTS_PRIVATE_KEY, DARTS_CLI } from '$env/static/private';
import { uploadFilesInOutputs } from './pinata';

const execAsync = promisify(exec);

async function installDarts() {
	try {
		// Check if 'darts' binary exists
		await execAsync('command -v darts');
		console.log('Darts binary already installed.');
		return 'Darts binary is already installed.';
	} catch {
		// If not found and not in dev mode, install it
		console.log('Installing darts binary...');
		await execAsync('curl -sSL https://bit.ly/install-darts | DARTS_LOC=darts bash -s -- darts');

		console.log('Darts installation successful.');
		return 'Darts binary installed successfully.';
		return 'Skipping installation in development mode.';
	}
}

export interface JobSpec {
	module?: string;
	version?: string; //version
	inputs?: Record<string, string | number>;
}

if (!dev) {
	// await execAsync(`curl -sSL https://bit.ly/install-darts | bash -s -- darts`);
	await installDarts();
}

// function formatText(input: string): string {
// 	// Replace all spaces with '-'
// 	const formattedText = input.replace(/\s+/g, '-');
// 	// Append '.png' at the end
// 	return `${formattedText}.png`;
// }

export const POST: RequestHandler = async ({ request }) => {
	const jobDto: JobSpec = await request.json();

	if (!jobDto) {
		return json({ error: 'Missing inputs in request body' }, { status: 400 });
	}

	if (!jobDto.module) {
		jobDto.module ??= 'cowsay';
		jobDto.version ??= 'v0.1.3';
		jobDto.inputs = {
			Message: 'ideomind says hi'
		};
	} else {
		jobDto.version ??= 'HEAD';
	}

	// Construct CLI input flags
	const inputFlags = Object.entries(jobDto.inputs || {})
		.map(([key, value]) => `-i ${key}="${value}"`)
		.join(' ');

	console.log('inputFlags', inputFlags);

	// Set environment variables
	const pKey = DARTS_PRIVATE_KEY;
	const debug = DEBUG == '1' || DEBUG == 'true';

	const platform = process.platform;
	const dartsBin = platform === 'linux' ? 'darts-linux' : 'darts-mac';

	const dartsCli = DARTS_CLI || 'darts';

	const envVars = {
		DARTS_PRIVATE_KEY: pKey,
		DEBUG: debug
	};

	const envVarsString = Object.entries(envVars)
		.map(([key, value]) => `${key}="${value}"`)
		.join(' ');

	const command = `${dartsCli} run ${jobDto.module}:${jobDto.version} ${inputFlags} `;
	// TODO: module

	console.log(command);

	// Execute the command
	return new Promise((resolve) => {
		// TODO:
		const childProcess = exec(`${envVarsString} ${command}`);

		let outputFolder: string | null = null;
		let stderr: string = '';
		let stdout: string = '';

		childProcess.stdout?.on('data', (out) => {
			console.log(`stdout: ${out}`);
			stdout = out.toString();
			outputFolder = extractLocationURL(stdout);
		});

		childProcess.stderr?.on('data', (_stderr) => {
			console.error(`stderr: ${_stderr}`);
			stderr = _stderr.toString();
		});

		childProcess.on('close', async (code) => {
			console.log(`child process exited with code ${code}`);
			if (code === 0 && outputFolder) {
				//upload image + `/outputs/${formatText(jobDto.inputs?.Prompt as string)}`
				try {
					const uploadResponse = await uploadFilesInOutputs(outputFolder);
					console.log('Image upload successful:', uploadResponse);
					resolve(json({ outputFolder, stdout, command, uploadResponse }));
				} catch (uploadError) {
					console.error('Error uploading image:', uploadError);
					resolve(
						json(
							{
								error: 'Image upload failed.',
								details: uploadError instanceof Error ? uploadError.message : 'Unknown error',
								outputFolder,
								stdout,
								command
							},
							{ status: 500 }
						)
					);
				}
			} else {
				resolve(
					json(
						{ error: `Command execution failed with code ${code}`, stdout, stderr, command },
						{ status: 500 }
					)
				);
			}
		});
	});
};
