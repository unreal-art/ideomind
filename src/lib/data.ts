import type { Like, Post, User } from './types';

const users: User[] = [
	{
		id: 'u1',
		name: 'Alice Johnson',
		username: 'alicej',
		email: 'alicejohnson@gmail.com',
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
		email: 'bobsmith@gmail.com',
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
		id: 'd3aed157-239d-42a0-ae41-935ae9cb1f38',
		author: 'u1',
		isPrivate: false,
		prompt:
			'closeup portrait photo of beautiful goth woman, makeup, 8k uhd, high quality, dramatic, cinematic',
		isPinned: false,
		category: 'GENERATION',
		likes: 1,
		images: [],
		ipfsImages: [
			{
				id: '0193b239-6416-7abc-851d-88cec70d8ab1',
				name: 'b73519a5-0772-4204-9cc0-193c33d74aeb.png',
				cid: 'bafybeihtr4p4dtezmffggxknh7i2vqmeawq6chp7wmhab3hlxh5rmilubi',
				created_at: '2024-12-10T20:18:51.231Z',
				size: 1386994,
				number_of_files: 1,
				mime_type: 'image/png',
				user_id: '9bdabd8f-cfa3-4c5d-9b92-ac18128b6c15'
			}
		],
		device: 'xpu',
		cpu: 30,
		createdAt: new Date('2024-12-10T20:18:51.739Z')
	},
	{
		id: 'c22a74a7-14a2-481d-805a-22485c1d7c36',
		author: 'u1',
		isPrivate: false,
		prompt:
			'close up photo of a rabbit, forest in spring, haze, halation, bloom, dramatic atmosphere, centred, rule of thirds, 200mm 1.4f macro shot',
		isPinned: false,
		category: 'GENERATION',
		likes: 1,
		images: [],
		ipfsImages: [
			{
				id: '0193b265-5b15-7994-9b91-bead4e8825fc',
				name: '6aaa991e-2ca0-47ff-a64c-1512a23dac45.png',
				cid: 'bafybeifdgzkvqqckfvmy2bfdzum6l7gbzfatfhlqumvk5uvjyi5bhq5myi',
				created_at: '2024-12-10T21:06:48.869Z',
				size: 1336763,
				number_of_files: 1,
				mime_type: 'image/png',
				user_id: '9bdabd8f-cfa3-4c5d-9b92-ac18128b6c15'
			}
		],
		cpu: 30,
		device: 'xpu',
		createdAt: new Date('2024-12-10T21:06:49.696Z')
	},

	{
		id: '5950624c-3223-4931-b5a8-c5ddd10a548e',
		author: 'u1',
		isPrivate: false,
		prompt:
			'johnny depp photo portrait, film noir style, monochrome, high contrast, dramatic shadows, 1940s style, mysterious, cinematic',
		isPinned: false,
		category: 'GENERATION',
		likes: 1,
		images: [],
		ipfsImages: [
			{
				id: '0193c5b2-f154-72d8-a74a-9321063d161b',
				name: '7230d2da-3a2f-4824-8635-e8edcdee9b34.png',
				cid: 'bafybeidwjhdltsex7xbhuh7dl6xhrrpoevv5p37gfqjka2du3uazwwnzwi',
				created_at: '2024-12-14T15:04:20.807Z',
				size: 1494218,
				number_of_files: 1,
				mime_type: 'image/png',
				user_id: '9bdabd8f-cfa3-4c5d-9b92-ac18128b6c15'
			}
		],
		cpu: 30,
		device: 'xpu',
		createdAt: new Date('2024-12-14T15:04:21.416Z')
	}
];

const likes: Like[] = [
	{
		id: 'l1',
		post: posts[0],
		user: users[0] // Bob liked Alice's post
	},
	{
		id: 'l1',
		post: posts[1],
		user: users[0] // Bob liked Alice's post
	},
	{
		id: 'l1',
		post: posts[2],
		user: users[0] // Bob liked Alice's post
	}
];

// Setting up circular references for `following`
users[0].following.push(users[1]); // Alice follows Bob
users[1].following.push(users[0]); // Bob follows Alice

export { users, posts, likes };
