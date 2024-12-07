export interface JobSpec {
	module?: string;
	version?: string;
	inputs?: Record<string, string>;
}

export type Category = 'EDIT' | 'UPSCALE' | 'GENERATION' | 'UPLOAD';

export interface Post {
	id: string;
	author: string;
	isPrivate: boolean;
	prompt: string;
	isPinned: boolean;
	category: Category;
	likes: number;
	images: string[];
	createdAt: Date;
}

export interface Like {
	id: string;
	post: Post;
	user: User;
}

export interface User {
	id: string;
	name?: string;
	username?: string;
	image?: string;
	bio: string;
	followerCount: number;
	followingCount: number;
	following: User[];
	location?: string | null;
	likesReceived: number;
	creditBalance: number;
	createdAt: Date;
	updatedAt: Date;
}
