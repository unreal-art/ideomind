// Extract the location URL from the output
export function extractLocationURL(output: string): string | null {
	const regex = /open\s+(.*)\s+cat\s+.*\s/;
	const match = output.match(regex);
	return match ? match[1] : null;
}
