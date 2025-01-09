import { authenticate, isAuthenticated } from "@/api"; // Your existing authentication logic
import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import bluebird from "bluebird";
import { supabase } from "@src/supabaseClient";
import { ethers } from "ethers6";

interface WalletObject {
	privateKey: string;
	publicKey: string;
}

function generateEthereumWallet(): WalletObject {
	// Generate Ethereum Wallet using ethers.js
	const wallet = ethers.Wallet.createRandom();

	return {
		privateKey: wallet.privateKey,
		publicKey: wallet.publicKey
	};
}

export const load: LayoutLoad = async ({ url }) => {
	// Get the current path
	const currentPath = url.pathname;

	const { data: sessionData, error } = await supabase.auth.getSession();
	const userData = sessionData?.session?.user || null;
	// console.log("session", sessionData);

	// If the user is authenticated:
	if (sessionData) {
		// Redirect authenticated users from `/` to `/explore`

		const userData = sessionData?.session?.user || null;
		// console.log("session", sessionData);
		const { data: profileData } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userData?.id);

		if (!profileData) return;
		const user = {
			id: profileData[0].id,
			name: profileData[0].full_name,
			username: userData?.user_metadata.name,
			email: userData?.email,
			image: userData?.user_metadata.picture,

			bio: profileData[0].bio,
			followerCount: profileData[0].follower_count,
			followingCount: profileData[0].following_count,
			following: [],
			location: profileData[0].location,
			likesReceived: profileData[0].likesReceived,
			creditBalance: profileData[0].credit_balance,
			//@ts-ignore
			createdAt: new Date(userData?.created_at),
			//@ts-ignore
			updatedAt: new Date(userData?.updated_at)
		};

		if (!profileData[0].wallet) {
			const wallet = generateEthereumWallet();
			console.log(wallet);

			const { data, error } = await supabase
				.from("profiles")
				.update({ wallet }) // Set new wallet
				.eq("id", profileData[0].id) // Where the user_id matches
				.single(); // Ensures only one row is returned

			if (error) {
				console.error("wallet update", error);
				return null;
			}
		}

		return { user };
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
