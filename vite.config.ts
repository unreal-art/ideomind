import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()]
	// hot reloading rules

	// server: {
	// 	host: true,
	// 	hmr: {
	// 		host: "localhost"
	// 	}
	// }
});
