export function isValidFileName(name: string): boolean {
	// Basic validation: empty strings are not allowed
	if (!name) return false;

	// Check if it's just a dot (hidden files/folders)
	if (name === ".") return false;

	// Check if it starts with a dot (hidden files/folders)
	if (name.startsWith(".")) {
		// Hidden files/folders are allowed, but we should check if they're valid after the dot
		const rest = name.slice(1);
		return rest.length > 0 && isValidFileName(rest);
	}

	// // Check if it contains invalid characters
	// const invalidChars = /[\/*?:<>|\\]/;
	// if (invalidChars.test(name)) return false;

	// Check if it exceeds maximum length
	const maxNameLength = 255; // Windows limit
	if (name.length > maxNameLength) return false;

	// If we pass all checks, it's a valid file/folder name
	return true;
}

export function isHighQualityImage(filename: string): boolean {
	if (!isValidFileName(filename)) {
		return false;
	}
	// const lowQExt = ["webp", "svg", "ico"];
	const highQExt = ["jpeg", "jpg", "png"];

	return highQExt.includes(filename.toLowerCase().split(".").pop() || "");
}
