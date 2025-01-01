import { exec } from "child_process";
import { json, type RequestHandler } from "@sveltejs/kit";
import { extractLocationURL, type JobSpec } from "./darts";
import { DARTS_DEBUG } from "$env/static/private";
import { dev } from "$app/environment";

import { DARTS_PRIVATE_KEY, DARTS_CLI } from "$env/static/private";
import { uploadFilesInOutputs } from "./lighthouse";
import { postDataToDb } from "./postDataToDb";
import Bluebird from "bluebird";

if (!dev) {
	// await execAsync(`curl -sSL https://bit.ly/install-darts | bash -s -- darts`);
	// await installDarts();
	console.log("installing darts doesn't seem to work");
}

export const POST: RequestHandler = async ({ request }) => {
	let Ephemeral = false;
	let pKey = DARTS_PRIVATE_KEY;

	const authHeader = request.headers.get("Authorization");
	if (!authHeader) {
		console.log("Unauthorized");
		// return new Response("Unauthorized", { status: 401 }); //TODO:
		// Ephemeral = true; //TODO: it doesn't work with US instances
	} else {
		const token = authHeader.split(" ")[1]; //This is fine as we are using HTTPS , with HTTP vulnerable to MITM
		if (token) {
			pKey = token;
		}
	}

	const jobDto: JobSpec = await request.json();

	if (!jobDto) {
		return json({ error: "Missing inputs in request body" }, { status: 400 });
	}

	jobDto.version ??= "HEAD";

	// Construct CLI input flags
	const inputFlags = Object.entries(jobDto.inputs || {})
		.map(([key, value]) => `-i ${key.trim()}="${value.toString().trim()}"`)
		.join(" ");

	console.log("inputFlags", inputFlags);

	// Set environment variables
	const debug = DARTS_DEBUG == "1" || DARTS_DEBUG == "true";

	console.log("debug", DARTS_DEBUG);

	const platform = process.platform;
	const dartsBin = platform === "linux" ? "darts-linux" : "darts-mac";

	const dartsCli = DARTS_CLI || "darts";

	const envVars = {
		DARTS_PRIVATE_KEY: pKey,
		DEBUG: debug.toString(),
		Ephemeral
	};

	const envVarsString = Object.entries(envVars)
		.map(([key, value]) => `${key.trim()}="${value.toString().trim()}"`)
		.join(" ");

	const command = `${dartsCli} run ${jobDto.module}:${jobDto.version} ${inputFlags} `;
	// TODO: module

	console.log("command", JSON.stringify(command));

	// Execute the command
	return new Promise((resolve) => {
		// TODO:
		const childProcess = exec(`${envVarsString} ${command}`);

		let outputFolder: string | null = null;
		let stderr: string = "";
		let stdout: string = "";

		childProcess.stdout?.on("data", (out) => {
			console.log(`stdout: ${out}`);
			stdout = out.toString();

			outputFolder = outputFolder || extractLocationURL(stdout);
		});

		childProcess.stderr?.on("data", (_stderr) => {
			console.error(`stderr: ${_stderr}`);
			stderr = _stderr.toString();
		});

		childProcess.on("close", async (code) => {
			console.log(`child process exited with code ${code}`);
			console.log(outputFolder);
			// (code === 0 || code === null) && outputFolder; sometime goroutines panic
			if (outputFolder) {
				//upload image + `/outputs/${formatText(jobDto.inputs?.Prompt as string)}`
				try {
					const uploadResponse = await uploadFilesInOutputs(outputFolder);
					console.log("Image upload successful:", uploadResponse);
					//post to db

					const dto = jobDto;

					await postDataToDb({
						device: dto.inputs?.Device,
						cpu: dto.inputs?.cpu,
						seed: dto.inputs?.Seed,
						prompt: dto.inputs?.Prompt,
						n: dto.inputs?.N,

						author: dto.author ?? "e260b0ab-9867-4507-97be-976779c20c9f",
						ipfsImages: uploadResponse,
						isPrivate: dto.isPrivate ?? false,
						isPinned: dto.isPinned ?? false,
						category: "GENERATION"
					});
					resolve(json({ outputFolder, stdout, command, uploadResponse }));
				} catch (uploadError) {
					console.error("Error uploading image/post:", uploadError);
					resolve(
						json(
							{
								error: "Image upload failed.",
								details: uploadError instanceof Error ? uploadError.message : "Unknown error",
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

export async function OPTIONS() {
	return new Response(null, {
		headers: {
			"Access-Control-Allow-Origin": "*", // Specify the url you wish to permit
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type"
		}
	});
}
