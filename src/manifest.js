const sharedManifest = {
	content_scripts: [
		{
			js: ["src/entries/scripts/twitter.ts"],
			matches: ["*://*.twitter.com/*", "*://twitter.com/*"],
		},
	],
	icons: {
		16: "icons/16.png",
		19: "icons/19.png",
		32: "icons/32.png",
		38: "icons/38.png",
		48: "icons/48.png",
		64: "icons/64.png",
		96: "icons/96.png",
		128: "icons/128.png",
		256: "icons/256.png",
		512: "icons/512.png",
	},
	options_ui: {
		chrome_style: false,
		page: "src/entries/options/index.html",
	},
	permissions: ["storage"],
};

const browserAction = {
	default_icon: {
		16: "icons/16.png",
		19: "icons/19.png",
		32: "icons/32.png",
		38: "icons/38.png",
	},
};

export const ManifestV2 = {
	...sharedManifest,
	browser_action: browserAction,
	manifest_version: 2,
	permissions: [...sharedManifest.permissions],
	browser_specific_settings: {
		gecko: {
			id: "twitter-deepl@absolucy.moe",
		},
	},
};

export const ManifestV3 = {
	...sharedManifest,
	action: browserAction,
	manifest_version: 3,
};
