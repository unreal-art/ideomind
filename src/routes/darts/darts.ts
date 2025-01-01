import { exec } from "child_process";
import { promisify } from "util";

// Extract the location URL from the output
export function extractLocationURL(output: string): string | null {
	const regex = /open\s+(.*)\s+cat\s+.*\s/;
	const match = output.match(regex);
	return match ? match[1] : null;
}

const execAsync = promisify(exec);

async function installDarts() {
	try {
		// Check if 'darts' binary exists
		await execAsync("command -v darts");
		console.log("Darts binary already installed.");
		return "Darts binary is already installed.";
	} catch {
		// If not found and not in dev mode, install it
		console.log("Installing darts binary...");
		await execAsync("curl -sSL https://bit.ly/install-darts | DARTS_LOC=darts bash -s -- darts");

		console.log("Darts installation successful.");
		return "Darts binary installed successfully.";
		return "Skipping installation in development mode.";
	}
}

import type { Post } from "@/types";

export interface JobSpec extends Post {
	module?: string;
	version?: string; //version
	inputs?: Record<string, string | number>;
}
