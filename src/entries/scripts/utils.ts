import { get_element } from "./get_element";
import { HASHTAG } from "./selectors";

export function mode<T>(myArray: Array<T>) {
	return myArray.reduce(
		(a, b, _, arr) =>
			arr.filter(v => v === a).length >= arr.filter(v => v === b).length
				? a
				: b,
		null
	);
}

export async function is_hashtag(
	element: HTMLElement
): Promise<HTMLLinkElement | null> {
	return (await get_element(HASHTAG, {
		name: "hashtag",
		timeout: 100,
		context: element,
	})) as HTMLLinkElement | null;
}
