import { writable } from 'svelte/store';
import * as db from '$lib/data';
import type { Post, User, Like } from '$lib/types';

// Define the initial state
const initialState: {
	user: User | null;
	posts: Post[];
	likes: Like[];
	isAuthenticated: boolean;
	users: User[];
} = {
	user: null, // Stores the authenticated user
	posts: [], // Array of posts
	likes: [], // Array of likes
	users: [],
	isAuthenticated: false // Authentication status
};

const createStore = () => {
	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		// Fetch and initialize data
		initialize: () => {
			const { users, posts, likes } = db;

			set({
				user: users[0], // Assuming Alice is the authenticated user
				posts,
				likes,
				users,
				isAuthenticated: true
			});
		},
		// Function to authenticate a user
		authenticateUser: (user: User) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: true
			}));
		},

		// Function to update user details
		updateUser: (user: Partial<User>) => {
			update((state) => ({
				...state,
				user: { ...state.user, ...user }
			}));
		},

		// Function to create a post
		createPost: (post: Post) => {
			update((state) => ({
				...state,
				posts: [...state.posts, post]
			}));
		},

		// Function to like a post
		likePost: (postId: string, userId: string) => {
			update((state) => {
				const post = state.posts.find((p) => p.id === postId);
				const user = state.user;

				if (!post || !user || user.id !== userId) return state; // Return unchanged state if post or user not found

				// Check if the user has already liked the post
				const likeIndex = state.likes.findIndex(
					(like) => like.post.id === postId && like.user.id === userId
				);

				if (likeIndex !== -1) {
					// User already liked the post, so unlike it
					return {
						...state,
						likes: state.likes.filter((_, index) => index !== likeIndex), // Remove the like
						posts: state.posts.map(
							(p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p) // Decrement the likes count for the post
						)
					};
				} else {
					// User has not liked the post, so like it
					const newLike: Like = {
						id: `${userId}-${postId}`,
						post,
						user
					};

					return {
						...state,
						likes: [...state.likes, newLike], // Add the new like to the likes array
						posts: state.posts.map(
							(p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p) // Increment the likes count for the post
						)
					};
				}
			});
		},
		getState: () => {
			let state: typeof initialState;
			subscribe(($store) => {
				state = $store;
			})();
			return state;
		},

		// Reset store to the initial state
		reset: () => set(initialState)
	};
};

export const store = createStore();
