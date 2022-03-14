async function is_sync_enabled(): Promise<boolean> {
	let sync_enabled: boolean = (await browser.storage.local.get("sync"))["sync"];
	return sync_enabled;
}

export async function set(object: object): Promise<void> {
	if (await is_sync_enabled()) {
		await browser.storage.sync.set(object);
	} else {
		await browser.storage.local.set(object);
	}
}

export async function get(key: string): Promise<any> {
	if (await is_sync_enabled()) {
		return (await browser.storage.sync.get(key))[key];
	} else {
		return (await browser.storage.local.get(key))[key];
	}
}
