export async function set(object: object) {
	if (typeof browser === "object") {
		await browser.storage.sync.set(object);
	} else {
		return new Promise<void>((resolve, _reject) => {
			chrome.storage.sync.set(object, () => {
				resolve();
			});
		});
	}
}

export async function get(key: string): Promise<any> {
	if (typeof browser === "object") {
		return await browser.storage.sync.get(key);
	} else {
		// create a new promise
		return new Promise((resolve, _reject) => {
			chrome.storage.sync.get(key, result => {
				resolve(result[key]);
			});
		});
	}
}
