// Update the path to your Supabase client
import type { User } from "@/types";
import { supabase } from "../../supabaseClient";
import { authenticate } from "@/api";
import { goto } from "$app/navigation";
import type { LayoutLoad } from "./$types";
import { store } from "$lib/store";

export const load: LayoutLoad = async ({ url }) => {
	// Get the full URL to pass to `exchangeCodeForSession`
	const fullUrl = url.href;

	// Exchange the code for a session if the user is redirected back from Discord
	if (url.searchParams.has("access_token") || url.searchParams.has("code")) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);

		if (error) {
			console.error("Error during token exchange:", error.message);
			// return { user: null, error: error.message };
			goto("/");
		}
	}

	// Get the current user session after token exchange
	const { data: sessionData } = await supabase.auth.getSession();
	const userData = sessionData?.session?.user || null;
	const { data: profileData, error } = await supabase
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

	authenticate(user);

	//fetch post data
	try {
		// Fetch posts with likes
		const { data: posts, error } = await supabase.from("posts").select(`
        *,
        likes (
          *
        )
      `);

		if (error) {
			console.error("Error fetching posts with likes:", error);
			return { posts: [] };
		}

		store.initPosts(posts);
	} catch (err) {
		console.error("Unexpected error:", err);
		return { posts: [] };
	}

	return { user: userData || null };
};
