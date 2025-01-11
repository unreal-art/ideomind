import { writable } from "svelte/store";
import { createAppKit } from "@reown/appkit";
import { mainnet, arbitrum } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "viem";
import { http, createConfig } from "@wagmi/core";

// 1. Define TypeScript types for the store
export interface AppKitStore {
	modal: ReturnType<typeof createAppKit>;
	wagmiConfig: ReturnType<typeof createConfig>;
	openConnectModal: () => void;
	openNetworkModal: () => void;
}

// 2. Get a project ID at https://cloud.reown.com
const projectId = import.meta.env.VITE_WALLET_CONNECT_ID;

const torusTestnet = defineChain({
	id: 8194, // Replace with the actual chain ID for the Torus testnet
	name: "Torus Testnet",
	network: "torus-testnet",
	nativeCurrency: {
		decimals: 18,
		name: "Torus Ether",
		symbol: "TTQF"
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.testnet.toruschain.com"], // Replace with actual HTTP RPC URL
			webSocket: ["wss://rpc.testnet.toruschain.com/ws"] // Replace with actual WebSocket RPC URL
		},
		public: {
			http: ["https://rpc.testnet.toruschain.com"], // Public HTTP RPC URL
			webSocket: ["wss://rpc.testnet.toruschain.com/ws"] // Public WebSocket URL
		}
	},
	blockExplorers: {
		default: {
			name: "Torus Explorer",
			url: "https://testnet.toruscan.com" // Replace with actual block explorer URL
		}
	}
});

// 3. Set up Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
	projectId,
	networks: [torusTestnet]
});

const wagmiConfig = createConfig({
	chains: [torusTestnet],
	transports: {
		[torusTestnet.id]: http()
	}
});

// 4. Configure the metadata
const metadata = {
	name: "AppKit",
	description: "AppKit Example",
	url: "https://example.com", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/179229932"]
};

// 5. Create the modal instance
const modal = createAppKit({
	adapters: [wagmiAdapter],
	networks: [torusTestnet],
	metadata,
	projectId,
	features: {
		analytics: true // Optional - defaults to your Cloud configuration
	},
	themeVariables: {
		"--w3m-border-radius-master": "1px",
		"--w3m-accent": "#2c3e50"
	}
});

// 6. Create the writable store
export const appkitStore = writable<AppKitStore>({
	modal,
	wagmiConfig,
	openConnectModal: () => modal.open(),
	openNetworkModal: () => modal.open({ view: "Networks" })
});
