// Update the path to your Supabase cl
import { authenticate, getPostsForAuthPage } from "@/api";

import { goto } from "$app/navigation";
import type { LayoutLoad } from "./$types";
import { store } from "$lib/store";
import bluebird from "bluebird";
import { ethers } from "ethers";
import { supabase } from "@src/supabaseClient";

// Type definition for the wallet
interface WalletObject {
	privateKey: string;
	publicKey: string;
}

// Function to generate Ethereum wallet
function generateEthereumWallet(): WalletObject {
	// Generate Ethereum Wallet using ethers.js
	const wallet = ethers.Wallet.createRandom();

	return {
		privateKey: wallet.privateKey,
		publicKey: wallet.publicKey
	};
}

function redirectOnLogin() {
	console.count("redirecting");
	goto("/explore");
}

export const load: LayoutLoad = async ({ url }) => {
	//get posts for auth page
	getPostsForAuthPage();

	const fullUrl = url.href;
	// console.log(`Loading ${fullUrl}`);

	// console.log("searchParams: " + url.searchParams); //its empty for the reason that its prepend by #


	// Exchange the code for a session if the user is redirected back from Discord
	if (fullUrl.includes("access_token") || fullUrl.includes("code")) {
		const accessToken = url.searchParams.get("access_token") || url.searchParams.get("code");

		console.log("access token: " + accessToken);

		// const { data, error } = await supabase.auth.exchangeCodeForSession(accessToken as string);
		const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);

		if (error) {
			console.error("Error during token exchange:", error.message);

			await bluebird.delay(5 * 1000);
			// return { user: null, error: error.message };
			console.log("redirecting to /auth");
			goto("/auth");
		}

		// Get the current user session after token exchange
		const { data: sessionData } = await supabase.auth.getSession();
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

	}
};
