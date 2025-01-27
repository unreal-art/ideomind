// global.d.ts
export {};

declare global {
	interface Window {
		ethereum?: any; // Declare Ethereum provider
	}
}
