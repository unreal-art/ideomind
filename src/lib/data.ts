import type { Like, Post, User } from './types';

const users: User[] = [
	{
		id: 'u1',
		name: 'Alice Johnson',
		username: 'alicej',
		image: '/assets/ima1.jpg',
		bio: 'With a background in both pharmacy and technology, Codypharm is a skilled developer specializing in full-stack blockchain solutions. Having honed their expertise through roles in decentralized AI platforms and Web3 projects, they bridge the gap between cutting-edge technologies and practical, user-centric applications. Codypharm is passionate about creating intuitive, secure, and scalable systems, with a strong focus on smart contract development, decentralized finance, and cross-chain interoperability.',
		followerCount: 120,
		followingCount: 50,
		following: [],
		location: 'New York, USA',
		likesReceived: 340,
		creditBalance: 25.5,
		createdAt: new Date('2023-06-01T12:00:00Z'),
		updatedAt: new Date('2023-11-01T09:30:00Z')
	},
	{
		id: 'u2',
		name: 'Bob Smith',
		username: 'bobsmith',
		image: '/assets/ima1.jpg',
		bio: 'Codypharm is a full-stack developer with extensive experience in blockchain technology and a strong foundation in pharmacy. Their work spans various Web3 technologies, including smart contract development, decentralized applications (dApps), and cross-chain solutions. With a focus on creating seamless user experiences and scalable platforms, Codypharm has contributed to projects utilizing Next.js, Solidity, TypeScript, and decentralized protocols like Wormhole and zkSync. They thrive in dynamic, tech-driven environments where innovation meets practical application.',
		followerCount: 200,
		followingCount: 180,
		following: [],
		location: 'Los Angeles, USA',
		likesReceived: 590,
		creditBalance: 72.0,
		createdAt: new Date('2022-12-15T10:15:00Z'),
		updatedAt: new Date('2024-11-30T14:45:00Z')
	}
];

const posts: Post[] = [
	{
		id: 'p1',
		author: 'u1',
		isPrivate: false,
		prompt: 'A serene forest with a magical aura',
		isPinned: true,
		category: 'GENERATION',
		likes: 120,
		images: ['/assets/ima2.jpeg', '/assets/ima1.jpg'],
		createdAt: new Date('2024-12-01T08:30:00Z')
	},
	{
		id: 'p2',
		author: 'u1',
		isPrivate: true,
		prompt: 'A futuristic cityscape at night',
		isPinned: false,
		category: 'EDIT',
		likes: 300,
		images: ['/assets/ima1.jpg'],
		createdAt: new Date('2024-12-03T12:15:00Z')
	}
];

const likes: Like[] = [
	{
		id: 'l1',
		post: posts[0],
		user: users[1] // Bob liked Alice's post
	},
	{
		id: 'l2',
		post: posts[1],
		user: users[0] // Alice liked Bob's post
	}
];

// Setting up circular references for `following`
users[0].following.push(users[1]); // Alice follows Bob
users[1].following.push(users[0]); // Bob follows Alice

export { users, posts, likes };
