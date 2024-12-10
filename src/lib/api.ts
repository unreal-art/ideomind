import axios from 'axios';
import type { DartsJobData, JobSpec, Post, UploadResponse, User } from './types';
import { store } from '$lib/store';
// import { uploadImage } from '../routes/darts/pinata';
import { PinataSDK } from 'pinata';

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
		const { data }: DartsJobData = await axios.post('/darts', dto);

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

//get post belonging to a user
export const userPosts = (id: string | undefined): Post[] => {
	if (!id) return [];
	return store.getState().posts.filter((item) => item.author == id);
};
export const userOtherPosts = (id: string | undefined, postId: string, posts: Post[]): Post[] => {
	if (!id) return [];
	return posts.filter((item) => item.author == id && item.id != postId);
};

export const userLikedPosts = (id: string | undefined): Post[] => {
	if (!id) return []; // Handle case where id is undefined

	return store
		.getState()
		.likes.filter((item) => item.user.id === id) // Filter by user ID
		.map((item) => item.post);
};

export const getPost = (id: string, posts: Post[]): Post | null => {
	return posts.find((post) => post.id == id) || null;
};

export const getPostUserName = (authorId: string): string => {
	// if(!authorId) return ""
	return store.getState().users.filter((item) => item.id == authorId)[0]?.username || '';
};
export const getPostUserImage = (authorId: string): string => {
	// if(!authorId) return ""
	return store.getState().users.filter((item) => item.id == authorId)[0]?.image || '';
};

export const filterPostByCat = (posts: Post[], category: string): Post[] => {
	if (category == 'everything') return posts;
	return posts.filter((post) => post.category == category.toUpperCase());
};

export const postsByFollowed = (userId: string): Post[] => {
	const followedUsers = store.getState().users.filter((user) => user.id === userId);
	// Combine all posts from followed users
	return followedUsers.flatMap((user) => userPosts(user.id));
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
