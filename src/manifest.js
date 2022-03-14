const sharedManifest = {
	content_scripts: [
		{
			js: ["src/entries/scripts/twitter.ts"],
			matches: ["*://*.twitter.com/*", "*://twitter.com/*"],
		},
	],
	icons: {
		16: "icons/icon.svg",
		48: "icons/icon.svg",
		64: "icons/icon.svg",
		96: "icons/icon.svg",
		128: "icons/icon.svg",
		256: "icons/icon.svg",
		512: "icons/icon.svg",
		1024: "icons/icon.svg",
	},
	options_ui: {
		chrome_style: false,
		page: "src/entries/options/index.html",
	},
	permissions: [
		"storage",
		"https://api-free.deepl.com/v2/translate",
		"https://api.deepl.com/v2/translate",
	],
};

const browserAction = {
	default_icon: "icons/icon.svg",
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
