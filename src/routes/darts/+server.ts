// src/routes/api/handler/+server.ts
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import { json, type RequestHandler } from '@sveltejs/kit';
import { extractLocationURL } from './darts';

const execAsync = promisify(exec);

export const POST: RequestHandler = async ({ request }) => {
	const { inputURI } = await request.json();

	if (!inputURI) {
		return json({ error: 'Missing inputURI in request body' }, { status: 400 });
	}

	// Set environment variables
	const pKey = process.env.PRIVATE_KEY;
	const debug = true;

	const platform = process.platform;
	const dartsBin = platform === 'linux' ? 'darts-linux' : 'darts-mac';

	const dartsCli = process.env.DARTS_CLI || 'darts';

	const command = `DARTS_PRIVATE_KEY=${pKey} DEBUG=${debug} ${dartsCli} run github.com/feedback-box/SoM:v0.2.2-coopdarts.4`;

	// Execute the command
	return new Promise((resolve) => {
		const childProcess = exec(command);

		let outputFolder: string | null = null;
		let stderr: string = '';
		let stdout: string = '';

		childProcess.stdout?.on('data', (out) => {
			console.log(`stdout: ${out}`);
			outputFolder = extractLocationURL(out.toString());
			stdout = out.toString();
		});

		childProcess.stderr?.on('data', (_stderr) => {
			console.error(`stderr: ${_stderr}`);
			stderr = _stderr.toString();
		});

		childProcess.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			if (code === 0 && outputFolder) {
				resolve(json({ outputFolder }));
			} else {
				resolve(
					json(
						{ error: `Command execution failed with code ${code}: ${stderr},`, stdout, stderr },
						{ status: 500 }
					)
				);
			}
		});
	});
};
