interface ElementOptions {
	name?: string;
	multiple?: boolean;
	filter_multiple?: (element: HTMLElement) => boolean;
	stop_if?: () => boolean;
	timeout?: number;
	context?: Document | HTMLElement;
}

export const DEFAULT_OPTIONS: ElementOptions = {
	multiple: false,
	timeout: Infinity,
	context: document,
};

/**
 * @param {string} selector
 * @param {{ElementOptions}} [options]
 * @returns {Promise<HTMLElement | null>}
 */
export function get_element(
	selector: string,
	options: ElementOptions
): Promise<HTMLElement | Array<HTMLElement> | null> {
	return new Promise(resolve => {
		let startTime = Date.now();
		let rafId: number;
		let timeoutId: ReturnType<typeof setTimeout>;

		function stop(
			retval: HTMLElement | Array<HTMLElement> | null,
			reason: string = "unspecified reason"
		) {
			if (retval == null) {
				console.log(
					`stopped waiting for ${options.name || selector} after ${reason}`
				);
			} else if (Date.now() > startTime) {
				console.log(
					`${options.name || selector} appeared after ${
						Date.now() - startTime
					}ms`
				);
			}
			if (rafId) {
				cancelAnimationFrame(rafId);
			}
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			resolve(retval);
		}

		if (options.timeout !== Infinity) {
			timeoutId = setTimeout(
				stop,
				options.timeout,
				null,
				`${options.timeout}ms timeout`
			);
		}

		function queryAllElements() {
			let node_list = (options.context ?? document).querySelectorAll(selector);
			var elements = Array.from(node_list) as Array<HTMLElement>;
			if (options.filter_multiple) {
				elements = elements.filter(options.filter_multiple);
			}
			if (elements) {
				stop(elements);
			} else if (options.stop_if?.() === true) {
				stop(null, "stop_if condition met");
			} else {
				rafId = requestAnimationFrame(queryAllElements);
			}
		}

		function queryElement() {
			let element = (options.context ?? document).querySelector(
				selector
			) as HTMLElement;
			if (element) {
				stop(element);
			} else if (options.stop_if?.() === true) {
				stop(null, "stop_if condition met");
			} else {
				rafId = requestAnimationFrame(queryElement);
			}
		}

		if (options.multiple) {
			queryAllElements();
		} else {
			queryElement();
		}
	});
}
