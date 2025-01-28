import { defineChain } from "viem";

export const torusTestnet = defineChain({
	id: 8194,
	name: "Torus Testnet",
	nativeCurrency: {
		decimals: 18,
		name: "Torus Ether",
		symbol: "TTQF"
	},
	rpcUrls: {
		default: {
			http: ["https://rpc.testnet.toruschain.com"],
			webSocket: ["wss://rpc.testnet.toruschain.com/ws"]
		}
	},
	blockExplorers: {
		default: { name: "Torus Explorer", url: "https://testnet.toruscan.com" }
	}
});
