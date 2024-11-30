// src/routes/api/handler/+server.ts
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { json, type RequestHandler } from '@sveltejs/kit';
import { extractLocationURL } from './darts';
import { DEBUG } from '$env/static/private';

const execAsync = promisify(exec);

interface JobSpec {
	module?: string;
	version?: string; //version
	inputs?: Record<string, string>;
}

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
	const inputFlags = Object.entries(jobDto.inputs)
		.map(([key, value]) => `-i ${key}="${value}"`)
		.join(' ');

	console.log('inputFlags', inputFlags);

	// Set environment variables
	const pKey = process.env.PRIVATE_KEY;
	const debug = false;

	const platform = process.platform;
	const dartsBin = platform === 'linux' ? 'darts-linux' : 'darts-mac';

	const dartsCli = process.env.DARTS_CLI || 'darts';

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

		childProcess.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			if (code === 0 && outputFolder) {
				resolve(json({ outputFolder, stdout, command }));
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
