import { writable } from 'svelte/store';
import { browser } from '$app/environment'; // Import SvelteKit's environment helper
import * as db from '$lib/data';
import type { Post, User, Like } from '$lib/types';
import CircularJSON from 'circular-json';

// Define the initial state
const initialState: {
	user: User | null;
	posts: Post[];
	likes: Like[];
	isAuthenticated: boolean;
	users: User[];
} = {
	user: null,
	posts: [],
	likes: [],
	users: [],
	isAuthenticated: false
};

// Helper to persist and load state from localStorage
const persistKey = 'app-store';

const loadState = (): typeof initialState => {
	if (!browser) return initialState; // Return default state during SSR
	const storedState = localStorage.getItem(persistKey);
	return storedState ? JSON.parse(storedState) : initialState;
};

const saveState = (state: typeof initialState) => {
	if (browser) {
		const safeState = CircularJSON.stringify(state);
		localStorage.setItem(persistKey, safeState);
	}
};

const createStore = () => {
	const { subscribe, set, update } = writable(initialState);

	// Load state only on the client
	if (browser) {
		const savedState = loadState();
		set(savedState);
	}

	// Persist store updates to localStorage
	subscribe((state) => {
		if (browser) {
			saveState(state);
		}
	});

	return {
		subscribe,
		initialize: () => {
			if (!browser) return; // Avoid initializing on the server
			const { users, posts, likes } = db;

			set({
				user: users[0],
				posts,
				likes,
				users,
				isAuthenticated: true
			});
		},
		authenticateUser: (user: User) => {
			update((state) => ({
				...state,
				user,
				isAuthenticated: true
			}));
		},
		updateUser: (user: Partial<User>) => {
			update((state) => ({
				...state,
				user: { ...state.user, ...user }
			}));
		},
		createPost: (post: Post) => {
			update((state) => ({
				...state,
				posts: [...state.posts, post]
			}));
		},
		likePost: (postId: string, userId: string) => {
			update((state) => {
				const post = state.posts.find((p) => p.id === postId);
				const user = state.user;

				if (!post || !user || user.id !== userId) return state;

				const likeIndex = state.likes.findIndex(
					(like) => like.post.id === postId && like.user.id === userId
				);

				if (likeIndex !== -1) {
					return {
						...state,
						likes: state.likes.filter((_, index) => index !== likeIndex),
						posts: state.posts.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p))
					};
				} else {
					const newLike: Like = {
						id: `${userId}-${postId}`,
						post,
						user
					};

					return {
						...state,
						likes: [...state.likes, newLike],
						posts: state.posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
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
		reset: () => set(initialState)
	};
};

export const store = createStore();
