import { defineConfig, loadEnv } from "vite";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";
import { ManifestV2, ManifestV3 } from "./src/manifest";
import pkg from "./package.json";

export default defineConfig(({ mode }) => {
	const configEnv = loadEnv(mode, process.cwd(), "");

	const manifest = configEnv.MANIFEST_VERSION === "3" ? ManifestV3 : ManifestV2;

	return {
		plugins: [
			webExtension({
				manifest: {
					author: pkg.author,
					description: pkg.description,
					name: pkg.displayName ?? pkg.name,
					version: pkg.version,
					...manifest,
				},
			}),
		],
		resolve: {
			alias: {
				"~": path.resolve(__dirname, "./src"),
			},
		},
	};
});
