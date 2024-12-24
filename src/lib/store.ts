import { writable } from "svelte/store";
import { browser } from "$app/environment"; // Import SvelteKit's environment helper
import * as db from "$lib/data";
import type { Post, User, Like } from "$lib/types";
import CircularJSON from "circular-json";

// Define the initial state
const initialState: {
	user: User | null;
	posts: Post[];
	post: Post;
	likes: Like[];
	isAuthenticated: boolean;
	users: User[];
} = {
	user: null,
	posts: [],
	post: {} as Post,
	likes: [],
	users: [],
	isAuthenticated: false,
};

// Helper to persist and load state from localStorage
const persistKey = "app-store";

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

			// TODO: Fetch data from db if needed

			// set({
			// 	user,
			// 	posts,
			// 	likes,
			// 	users,
			// 	isAuthenticated: false,
			// 	isGeneratingFiles: false
			// });
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
				//@ts-ignore
				user: { ...state.user, ...user }
			}));
		},

		initPosts: (posts: Post[]) => {
			update((state) => ({
				...state,
				posts
			}));
		},
		initPost: (post: Post) => {
			update((state) => ({
				...state,
				post
			}));
		},
		createPost: (post: Post) => {
			update((state) => ({
				...state,
				posts: [...state.posts, post]
			}));
		},

	

		getState: () => {
			let state: typeof initialState;
			subscribe(($store) => {
				state = $store;
			})();
			//@ts-ignore
			return state;
		},
		reset: () => set(initialState)
	};
};


export const store = createStore();


