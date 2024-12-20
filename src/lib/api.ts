import axios from "axios";
import type { DartsJobData, FollowStats, JobSpec, Like, Post, User } from "./types";
import { store } from "$lib/store";
// import { uploadImage } from '../routes/darts/pinata';
import { PinataSDK } from "pinata";

import { PUBLIC_API_URL } from "$env/static/public";
import { supabase } from "../supabaseClient";

const pinata = new PinataSDK({
	pinataJwt: import.meta.env.VITE_PINATA_JWT!,
	pinataGateway: import.meta.env.VITE_PINATA_GATEWAY as string
});

export const getImageUrl = async (cid: string) => {
	try {
		const url = await pinata.gateways.createSignedURL({
			cid,
			expires: 1800
		});

		return url;
	} catch (error) {
		console.log(error);
	}
};

export async function generateImage(dto: JobSpec) {
	try {
		const { data }: DartsJobData = await axios.post(PUBLIC_API_URL || "" + "/darts", dto);

		return data;
	} catch (error) {
		console.error("Error:", error);
	}
}

// Function to authenticate a user
export const authenticate = (user: User) => {
	store.authenticateUser(user);
};

// Function to update user details
export const updateUserDetails = (user: Partial<User>) => {
	store.updateUser(user);
};

// Function to create a new post
export const createNewPost = async (post: Post) => {
	// store.createPost(post);
	const { data, error } = await supabase.from("posts").insert([
		{
			author: post.author,
			isPrivate: false,
			prompt: post.prompt,
			isPinned: post.isPinned,
			category: post.category,
			ipfsImages: post.ipfsImages,
			cpu: post.cpu,
			device: post.device
		}
	]);

	if (error) {
		console.error("Error inserting post:", error);
	} else {
		console.log("Post inserted successfully:", data);
		data && store.createPost(data)
	}
};

export const fetchPosts = async () => {
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
};
export const fetchProfilePosts = async () => {
	try {
		// Fetch posts with likes where author matches the specified value
		const { data: posts, error } = await supabase
			.from("posts")
			.select(
				`
            *,
            likes (
                *
            )
        `
			)
			.eq("author", store.getState().user?.id); // Filter posts by author

		if (error) {
			console.error("Error fetching posts with likes:", error);
			return { posts: [] };
		}

		store.initPosts(posts);
	} catch (err) {
		console.error("Unexpected error:", err);
		return { posts: [] };
	}
};

/**
 * Filters posts authored by the specified user.
 *
 * @param userId - The ID of the user whose posts to filter. If undefined, an empty array is returned.
 * @param allPosts - The array of posts to filter.
 * @returns An array of posts authored by the specified user.
 */
export const getUserPosts = (userId: string | undefined, allPosts: Post[]): Post[] => {
	// If no userId is provided, return an empty array (no filtering possible).
	if (!userId) return [];

	// Filter posts where the author's ID matches the provided userId.
	return allPosts.filter((post) => post.author === userId);
};

/**
 * Filters posts authored by a specific user, excluding a specific post.
 *
 * @param userId - The ID of the user whose posts to filter. If undefined, an empty array is returned.
 * @param excludedPostId - The ID of the post to exclude from the results.
 * @param allPosts - The array of posts to filter.
 * @returns An array of posts authored by the user, excluding the specified post.
 */
export const getUserOtherPosts = (
	userId: string | undefined,
	excludedPostId: string,
	allPosts: Post[]
): Post[] => {
	// If no userId is provided, return an empty array.
	if (!userId) return [];

	// Filter posts authored by the user, excluding the post with the given ID.
	return allPosts.filter((post) => post.author === userId && post.id !== excludedPostId);
};

export const fetchAuthorOtherPosts = async (authorId: string, excludePostId: string) => {
	if (!authorId || !excludePostId) return;
	try {
		// Fetch posts by the author, excluding the one with the specified ID
		const { data: posts, error } = await supabase
			.from("posts")
			.select(
				`
            *,
            likes (
                *
            )
        `
			) // Adjust columns as necessary
			.eq("author", authorId) // Filter by author ID
			.neq("id", excludePostId); // Exclude the post with this ID

		if (error) {
			console.error("Error fetching posts by author:", error);
			return [];
		}

		store.initPosts(posts);
	} catch (err) {
		console.error("Unexpected error fetching posts by author:", err);
		return [];
	}
};

export const fetchSelectedPost = async (slug: string) => {
	console.log(slug);
	if (!slug) {
		console.error("Slug is missing");
		return { post: null };
	}

	// Fetch the post with the matching slug
	const { data, error } = await supabase
		.from("posts")
		.select(
			`
                *,
                likes (
                    *
                )
            `
		)
		.eq("id", slug) // Assuming `slug` corresponds to the `id` column in the "posts" table
		.single(); // Fetch only a single row

	if (error) {
		console.error("Error fetching post:", error);
		return { data: null };
	}

	store.initPost(data);
};

/**
 * Retrieves posts liked by a specific user.
 *
 * @param userId - The ID of the user whose liked posts are to be retrieved. If undefined, an empty array is returned.
 * @returns An array of posts liked by the specified user.
 */
export const getUserLikedPosts = (): Post[] => {
	// Return an empty array if no userId is provided.
	const userId = store.getState().user?.id;

	const posts = store.getState().posts;

	// Filter posts where the user has liked them.
	const likedPosts = posts.filter((post) => post.likes.some((like: any) => like.author === userId));

	return likedPosts;
};

// Get the like count for a specific post by its ID.
export const getPostLikeCount = (postId: string | undefined, allPosts: Post[]): number => {
	if (!postId) return 0; // Return 0 if no ID is provided.
	const post = allPosts.find((post) => post.id === postId); // Find the post by ID.
	return post?.likes || 0; // Return likes or 0 if post not found.
};

// Retrieve a post by its ID, or return null if not found.
export const getPost = (id: string, posts: Post[]): Post | null => {
	return posts.find((post) => post.id === id) || null; // Use strict equality for type safety.
};

// Retrieve a user by their ID from the store, or return null if not found.
export const getUser = (id: string): User | null => {
	return store.getState().users.find((user) => user.id === id) || null;
};

// Retrieve a user's username by their ID, or return an empty string if not found.
export const getPostUserName = async (authorId: string): Promise<string | null> => {
	if (!authorId) {
		console.warn("Author ID is not provided.");
		return null;
	}

	try {
		// Fetch profile data for the matching ID
		const { data: profile, error } = await supabase
			.from("profiles")
			.select("full_name") // Select only the necessary field
			.eq("id", authorId)
			.single();

		if (error) {
			console.error(`Error fetching profile for author ID ${authorId}:`, error.message);
			return null;
		}

		return profile?.full_name || null; // Ensure safe access to the field
	} catch (err) {
		console.error(`Unexpected error fetching profile for author ID ${authorId}:`, err);
		return null;
	}
};

// Retrieve a user's profile image by their ID, or return an empty string if not found.
export const getPostUserImage = async (authorId: string): Promise<string | null> => {
	if (!authorId) {
		console.warn("Author ID is not provided.");
		return null;
	}

	try {
		// Fetch profile data for the matching ID
		const { data: profile, error } = await supabase
			.from("profiles")
			.select("avatar_url") // Select only the necessary field
			.eq("id", authorId)
			.single();

		if (error) {
			console.error(`Error fetching profile for author ID ${authorId}:`, error.message);
			return null;
		}

		return profile?.avatar_url || null; // Ensure safe access to the field
	} catch (err) {
		console.error(`Unexpected error fetching profile for author ID ${authorId}:`, err);
		return null;
	}
};

// Filter posts by category, returning all posts if 'everything' is selected.
export const filterPostByCat = (posts: Post[], category: string): Post[] => {
	if (category.toLowerCase() === "everything") return posts; // Handle 'everything' category.
	return posts.filter((post) => post.category === category.toUpperCase()); // Filter by category.
};

//get list of people  a person is following
async function getFollowsByFollowerId(followerId: string) {
	const { data, error } = await supabase
		.from("follows")
		.select("*") // You can specify columns if needed
		.eq("follower_id", followerId);

	if (error) {
		console.error("Error fetching follows:", error);
		return [];
	}
	return data;
}

export const postsByFollowed = async (userId: string) => {
	const userFollows = await getFollowsByFollowerId(userId);
	// const followedUsers = store.getState().users.filter((user) => user.id === userId);
	// // Combine all posts from followed users
	return userFollows.flatMap((follow) => getUserPosts(follow.followee_id, store.getState().posts));
};

// Function to like a post
// Like a post for the given user by postId.

export async function likePost(
	postId: string,
	userId: string,
	page = "general",
	authorId = "",
	excludedPost = ""
) {
	try {
		// Check if a like already exists
		const { data: existingLike, error: fetchError } = await supabase
			.from("likes")
			.select("*")
			.eq("author", userId)
			.eq("post_id", postId)
			.single(); // Fetch only one record

		if (fetchError && fetchError.code !== "PGRST116") {
			// Ignore 'not found' errors (code PGRST116 indicates no rows found)
			console.error("Error fetching like:", fetchError);
			return null;
		}

		if (existingLike) {
			// Like exists, delete it
			const { error: deleteError } = await supabase
				.from("likes")
				.delete()
				.eq("id", existingLike.id); // Delete by primary key

			if (deleteError) {
				console.error("Error deleting like:", deleteError);
				return null;
			}

			console.log("Like removed");
		} else {
			// Like does not exist, add it
			const { data, error: insertError } = await supabase.from("likes").insert([
				{
					author: userId,
					post_id: postId
				}
			]);

			if (insertError) {
				console.error("Error adding like:", insertError);
				return null;
			}

			console.log("Like added");
		}

		// Refresh posts after toggling like
		if (page === "general") {
			await fetchPosts();
		} else if (page === "details") {
			await fetchAuthorOtherPosts(authorId, excludedPost);
			await fetchSelectedPost(postId);
		} else {
			await fetchPosts();
		}

		return { message: "Operation successful" };
	} catch (err) {
		console.error("An unexpected error occurred:", err);
		return null;
	}
}

// Function to reset the store (e.g., logout)
export const resetStore = () => {
	store.reset();
};

// Function to initialize data (e.g., after a page load or login)
export const initializeStore = () => {
	store.initialize();
};

export const getLikesReceivedByUser = async (userId: string | undefined): Promise<number> => {
	if (!userId) return 0;
	try {
		// Fetch posts with likes where author matches the specified value
		const { data: posts, error } = await supabase
			.from("posts")
			.select(
				`
            *,
            likes (
                *
            )
        `
			)
			.eq("author", userId); // Filter posts by author

		if (error) {
			console.error("Error fetching posts with likes:", error);
			return 0;
		}

		return posts.filter((post) => post.likes.length > 0).length || 0;
	} catch (err) {
		console.error("Unexpected error:", err);
		return 0;
	}
};

export const getFollowStats = async (userId: string | undefined): Promise<FollowStats> => {
	if (!userId)
		return {
			followeeCount: 0,
			followerCount: 0
		};

	try {
		// Fetch follower count
		const { count: followerCount, error: followerError } = await supabase
			.from("follows")
			.select("*", { count: "exact", head: true }) // Only count rows
			.eq("follower_id", userId);

		if (followerError) {
			throw new Error(`Error fetching follower count: ${followerError.message}`);
		}

		// Fetch followee count
		const { count: followeeCount, error: followeeError } = await supabase
			.from("follows")
			.select("*", { count: "exact", head: true }) // Only count rows
			.eq("followee_id", userId);

		if (followeeError) {
			throw new Error(`Error fetching followee count: ${followeeError.message}`);
		}

		// Return counts as a typed object
		return {
			followerCount: followerCount || 0,
			followeeCount: followeeCount || 0
		};
	} catch (error) {
		console.error("Error fetching follow stats:", error);
		throw error;
	}
};

// const fetchLikedPosts = async (userId) => {
// 	const { data, error } = await supabase
// 		.from("likes") // Start from the "likes" table
// 		.select(
// 			`
//             posts(*) // Fetch all columns from the "posts" table
//         `
// 		)
// 		.eq("author", userId); // Filter by the user ID

// 	if (error) {
// 		console.error("Error fetching liked posts:", error);
// 		return [];
// 	}

// 	return data;
// };
