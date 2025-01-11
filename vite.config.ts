import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	plugins: [
		nodePolyfills({
			exclude: ["fs"],
			globals: {
				Buffer: true,
				global: true,
				process: true
			},
			protocolImports: true
		}),
		sveltekit()
	],
	optimizeDeps: {
		include: ["dayjs/plugin/relativeTime.js", "dayjs", "@web3auth/ethereum-provider"]
	},
	// test: {
	// 	include: ["src/**/*.{test,spec}.{js,ts}"]
	// },
	resolve: {
		alias: {
			// "@": path.resolve("./"),
			// "@src": path.resolve("./src"),
			// "@routes": path.resolve("./src/routes"),
			// $routes: path.resolve("./src/routes"),
			// $lib: path.resolve("./src/lib"),
			// $stores: path.resolve("./src/stores"),
			// "@stores": path.resolve("./src/stores"),
			// $utils: path.resolve("./utils"),
			// "@utils": path.resolve("./utils"),
			// "@config": path.resolve("./config"),
			// "@components": path.resolve("./src/lib/components"),
			// $components: path.resolve("./src/lib/components")
		}
	}
});
