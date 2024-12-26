import type { JobSpec as IJobSpec } from "../routes/darts/+server";

export type JobSpec = IJobSpec;

export type Category = "EDIT" | "UPSCALE" | "GENERATION" | "UPLOAD";

export interface UploadResponse {
	name: string;
	hash: string;
	size: string;
}

export interface Post {
	id: string;
	author: string;
	isPrivate: boolean;
	prompt: string;
	isPinned: boolean;
	category: Category;
	likes: any;
	seed?: number;
	ipfsImages: UploadResponse[];
	cpu: number;
	device: string;
	createdAt: Date;
}

export interface Like {
	id: string;
	post_id: string;
	author: string;
}

export interface User {
	id: string;
	name?: string;
	username?: string;
	email?: string;
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

export type DartsJobData = {
	data: {
		command: string;
		outputFolder: string;
		stdout: string;
		uploadResponse: UploadResponse[];
	};
};

export type Output = {
	command: string;
	outputFolder: string;
	stdout: string;
	uploadResponse: UploadResponse[];
};

export interface FollowStats {
	followerCount: number;
	followeeCount: number;
}
