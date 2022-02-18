const sharedManifest = {
	content_scripts: [
		{
			js: ["src/entries/scripts/twitter.ts"],
			matches: ["*://*.twitter.com/*", "*://twitter.com/*"],
		},
	],
	icons: {},
	options_ui: {
		chrome_style: false,
		page: "src/entries/options/index.html",
	},
	permissions: ["storage"],
};

const browserAction = {};

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
