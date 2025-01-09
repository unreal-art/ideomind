import { formatDistanceToNow } from "date-fns";

// Define a function to abbreviate the output
export const abbreviateOutput = (date: Date, options?: { addSuffix?: boolean }): string => {
	// Get the full output from formatDistanceToNow
	const fullOutput = formatDistanceToNow(date, options);

	// Handle the case for "less than a minute ago"
	if (fullOutput === "less than a minute ago") {
		return "just now"; // Or any other user-friendly string
	}

	// Perform replacements for other time units
	return fullOutput
		.replace(/\bminutes?\b/, "mins") // Replace "minute" or "minutes" with "mins"
		.replace(/\bhours?\b/, "hrs") // Replace "hour" or "hours" with "hrs"
		.replace(/\bdays?\b/, "days") // Keep "days" unchanged
		.replace(/\bmonths?\b/, "mnths") // Replace "month" or "months" with "mos"
		.replace(/\byears?\b/, "yrs"); // Replace "year" or "years" with "yrs"
};
