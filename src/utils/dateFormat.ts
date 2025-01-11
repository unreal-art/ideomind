import { formatDistanceToNow } from "date-fns";

export const abbreviateOutput = (date: Date, options?: { addSuffix?: boolean }): string => {
	const fullOutput = formatDistanceToNow(date, options);

	if (fullOutput === "less than a minute ago") {
		return "just now";
	}

	return fullOutput
		.replace(/\babout\b\s*/g, "") // Remove "about"
		.replace(/\b1 minute\b/, "1 min") // Replace singular "1 minute"
		.replace(/\bminutes\b/, "mins") // Replace plural "minutes"
		.replace(/\b1 hour\b/, "1 hr") // Replace singular "1 hour"
		.replace(/\bhours\b/, "hrs") // Replace plural "hours"
		.replace(/\b1 day\b/, "1 day") // Singular "1 day" remains unchanged
		.replace(/\bdays\b/, "days") // Plural "days" remains unchanged
		.replace(/\b1 month\b/, "1 mnth") // Replace singular "1 month"
		.replace(/\bmonths\b/, "mnths") // Replace plural "months"
		.replace(/\b1 year\b/, "1 yr") // Replace singular "1 year"
		.replace(/\byears\b/, "yrs"); // Replace plural "years"
};
