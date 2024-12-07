import axios from 'axios';
import type { JobSpec, Post, User, Like } from './types';
import { store } from '$lib/store';

export async function generateImage(dto: JobSpec) {
	try {
		const res = await axios.post('/darts', dto);
		console.log(res);
		return res.data;
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

//get post belonging to a user
export const userPosts = (id: string | undefined): Post[] => {
	if (!id) return [];
	return store.getState().posts.filter((item) => item.author == id);
};

export const userLikedPosts = (id: string | undefined): Post[] => {
	if (!id) return []; // Handle case where id is undefined

	return store
		.getState()
		.likes.filter((item) => item.user.id === id) // Filter by user ID
		.map((item) => item.post);
};

// Function to like a post
export const likePost = (postId: string, userId: string) => {
	store.likePost(postId, userId);
};

// Function to reset the store (e.g., logout)
export const resetStore = () => {
	store.reset();
};

// Function to initialize data (e.g., after a page load or login)
export const initializeStore = () => {
	store.initialize();
};
