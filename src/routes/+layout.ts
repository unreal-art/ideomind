import { isAuthenticated } from "@/api"; // Your existing authentication logic
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import bluebird from "bluebird";

export const load: LayoutLoad = async ({ url }) => {
	// Get the current path
	const currentPath = url.pathname;
	console.log(currentPath);
	const authenticated = isAuthenticated();
	console.log(authenticated);
	// If the user is authenticated:
	if (authenticated) {
		// Redirect authenticated users from `/` to `/explore`
		if (currentPath === "/") {
			throw redirect(302, "/explore");
		}
		// Otherwise, allow access to any other route, like `/creations`
	} else {
		// If not authenticated, redirect to `/auth` (unless already on `/auth`)
		if (currentPath !== "/auth") {
			throw redirect(302, "/auth");
		}
	}

	// Allow the request to proceed for all other routes
	return {};
};
