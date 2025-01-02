import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [sveltekit()],

	resolve: {
		alias: {
			"@": path.resolve("./"),
			"@src": path.resolve("./src"),
			"@routes": path.resolve("./src/routes"),
			$routes: path.resolve("./src/routes"),
			$lib: path.resolve("./src/lib"),
			$stores: path.resolve("./src/stores"),
			"@stores": path.resolve("./src/stores"),
			$utils: path.resolve("./utils"),
			"@utils": path.resolve("./utils"),
			"@config": path.resolve("./config"),
			"@components": path.resolve("./src/lib/components"),
			$components: path.resolve("./src/lib/components")
		}
	}
	// hot reloading rules

	// server: {
	// 	host: true,
	// 	hmr: {
	// 		host: "localhost"
	// 	}
	// }
});
