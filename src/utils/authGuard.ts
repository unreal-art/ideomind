import { isAuthenticated } from "@/api"; // Your authentication logic
import { redirect } from "@sveltejs/kit";

export async function authGuard() {
	// Check if the user is authenticated
	if (!isAuthenticated()) {
		// Redirect unauthenticated users to /auth
		throw redirect(302, "/auth");
	}
}
