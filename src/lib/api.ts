import axios from 'axios';
import type { DartsJobData, JobSpec, Like, Post, User } from './types';
import { store } from '$lib/store';
// import { uploadImage } from '../routes/darts/pinata';
import { PinataSDK } from 'pinata';

import { PUBLIC_API_URL } from '$env/static/public';

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
		const { data }: DartsJobData = await axios.post(PUBLIC_API_URL || '' + '/darts', dto);

		return data;
	} catch (error) {
		console.error('Error:', error);
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
export const createNewPost = (post: Post) => {
	store.createPost(post);
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

/**
 * Retrieves posts liked by a specific user.
 *
 * @param userId - The ID of the user whose liked posts are to be retrieved. If undefined, an empty array is returned.
 * @returns An array of posts liked by the specified user.
 */
export const getUserLikedPosts = (userId: string | undefined): Post[] => {
	// If no userId is provided, return an empty array.
	if (!userId) return [];

	// Safely access the state and retrieve the list of liked posts for the user.
	return (
		store
			.getState()
			.likes // Filter by user ID.
			.filter((like) => like.user.id === userId)
			// Map the likes to their corresponding posts.
			.map((like) => like.post) || []
	);
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
export const getPostUserName = (authorId: string): string => {
	if (!authorId) return ''; // Return an empty string if no authorId is provided.
	const user = store.getState().users.find((user) => user.id === authorId); // Find user by ID.
	return user?.username || ''; // Return username or an empty string if not found.
};

// Retrieve a user's profile image by their ID, or return an empty string if not found.
export const getPostUserImage = (authorId: string): string => {
	if (!authorId) return ''; // Return an empty string if no authorId is provided.
	const user = store.getState().users.find((user) => user.id === authorId); // Find user by ID.
	return user?.image || ''; // Return the image URL or an empty string if not found.
};

// Filter posts by category, returning all posts if 'everything' is selected.
export const filterPostByCat = (posts: Post[], category: string): Post[] => {
	if (category.toLowerCase() === 'everything') return posts; // Handle 'everything' category.
	return posts.filter((post) => post.category === category.toUpperCase()); // Filter by category.
};

export const postsByFollowed = (userId: string): Post[] => {
	const followedUsers = store.getState().users.filter((user) => user.id === userId);
	// Combine all posts from followed users
	return followedUsers.flatMap((user) => getUserPosts(user.id, store.getState().posts));
};

// Function to like a post
// Like a post for the given user by postId.
export const likePost = (postId: string, userId: string): void => {
	if (!postId || !userId) return; // Ensure both postId and userId are provided.
	store.likePost(postId, userId); // Call the store's likePost method.
};

// Function to reset the store (e.g., logout)
export const resetStore = () => {
	store.reset();
};

// Function to initialize data (e.g., after a page load or login)
export const initializeStore = () => {
	store.initialize();
};
