import { get_element } from "./get_element";
import { TWEET, TWEET_INNER, TRANSLATE_TWEET } from "./selectors";
import { get } from "./storage";
import { mode, is_hashtag } from "./utils";

const LANGUAGE_NAMES = {
	"EN-US": "English (United States)",
	"EN-GB": "English (United Kingdom)",
	"BG": "Bulgarian",
	"CS": "Czech",
	"DA": "Danish",
	"DE": "German",
	"EL": "Greek",
	"ES": "Spanish",
	"ET": "Estonian",
	"FI": "Finnish",
	"HU": "Hungarian",
	"IT": "Italian",
	"JA": "Japanese",
	"LT": "Lithuanian",
	"LV": "Latvian",
	"NL": "Dutch",
	"PL": "Polish",
	"PT-PT": "Portuguese",
	"PT-BR": "Portuguese (Brazillian)",
	"RO": "Romanian",
	"RU": "Russian",
	"SK": "Slovak",
	"SL": "Slovenian",
	"SV": "Swedish",
	"ZH": "Chinese",
};

async function add_deepl() {
	let tweet = (await get_element(TWEET, {
		name: "tweet",
		timeout: 1500,
	})) as HTMLElement;
	if (!tweet) {
		return;
	}
	handle_translation(tweet);
}

async function handle_translation(tweet: HTMLElement) {
	let translate_button = (await get_element(TRANSLATE_TWEET, {
		name: "translate_button",
		filter_multiple: element => element.innerText === "Translate Tweet",
		timeout: 500,
		context: tweet,
	})) as HTMLElement;
	if (translate_button == null) {
		return;
	}
	let tweet_content = (await get_element(TWEET_INNER, {
		name: "inner",
		timeout: 500,
		context: tweet,
	})) as HTMLElement;
	if (!tweet_content) {
		return;
	}
	let new_translate_button = create_new_translate_button(
		translate_button,
		tweet_content
	);
	translate_button.parentElement.after(new_translate_button);
	// Remove the old translate button.
	translate_button.parentElement.remove();
}

function create_new_translate_button(
	copycat: HTMLElement,
	tweet_content: HTMLElement
): HTMLElement {
	let copycat_parent = copycat.parentElement;
	// Recreate as close to the original as possible
	let div = document.createElement("div");
	div.setAttribute("dir", "auto");
	div.setAttribute("role", "button");
	div.setAttribute("tabindex", "0");
	div.style.cssText = copycat_parent.style.cssText;
	div.classList.add(...Array.from(copycat_parent.classList));

	// Set up the inner span that actually contains the text
	let span = document.createElement("span");
	span.classList.add(...Array.from(copycat.classList));
	span.innerText = "Translate with DeepL";
	div.appendChild(span);

	// Set up click handler
	div.onclick = () => {
		deepl_translate(tweet_content, span);
	};
	// Set up hover handler
	div.onmouseover = () => {
		span.style.textDecoration = "underline";
	};
	div.onmouseout = () => {
		span.style.textDecoration = "none";
	};

	return div;
}

interface DeepLTranslation {
	text: string;
	detected_source_language: string;
}

interface DeepLResponse {
	translations: DeepLTranslation[];
}

async function deepl_translate(tweet: HTMLElement, span: HTMLElement) {
	let target_language: string = (await get("target_language")) || "EN-US";
	let api_key: string = (await get("api_key")) || "";
	let form_data = new FormData();
	form_data.append("auth_key", api_key);
	let children = Array();
	for (let i = 0; i < tweet.children.length; i++) {
		let child = tweet.children[i] as HTMLElement;
		if (child.tagName !== "SPAN") continue;
		if (child.innerText.trim() === "") continue;
		if ((await is_hashtag(child)) !== null) continue;
		form_data.append("text", child.innerText);
		children.push(child);
	}
	form_data.append("target_lang", target_language);
	const DEEPL_URL = api_key.endsWith(":fx")
		? "https://api-free.deepl.com/v2/translate"
		: "https://api.deepl.com/v2/translate";
	let response: DeepLResponse;
	try {
		let play_fetch = await fetch(DEEPL_URL, {
			method: "POST",
			body: form_data,
		});
		let json = await play_fetch.json();
		console.log(json);
		if (play_fetch.status !== 200) {
			switch (play_fetch.status) {
				case 403:
					on_error(
						json["message"],
						span,
						"You need to enter an API Key in the Twitter-DeepL settings!"
					);
					break;
				case 413:
				case 456:
					on_error(
						json["message"],
						span,
						"The text is too long to translate with DeepL!"
					);
					break;
				case 429:
					on_error(
						json["message"],
						span,
						"DeepL is rate-limiting you, wait a bit before trying again"
					);
					break;
				case 529:
					on_error(
						json["message"],
						span,
						"DeepL is overloaded, wait a bit before trying again"
					);
					break;
				default:
					on_error(json["message"], span);
					break;
			}
			return;
		}
		response = json;
	} catch (error) {
		on_error(error, span);
		return;
	}

	if (response.translations.length !== children.length) {
		on_error(
			`Unexpected number of translations: ${response.translations.length}, expected ${children.length}`,
			span
		);
		return;
	}

	for (let i = 0; i < children.length; i++) {
		let span = children[i];
		let translation = response.translations[i];
		span.innerText = translation.text;
	}

	span.parentElement.onclick = null;
	span.parentElement.onmouseover = null;
	span.parentElement.onmouseout = null;
	span.style.textDecoration = "none";

	let src_lang_name =
		LANGUAGE_NAMES[
			mode(
				response.translations.map(
					translation => translation.detected_source_language
				)
			)
		] ?? "Unknown";
	let target_lang_name = LANGUAGE_NAMES[target_language];
	span.innerText = `Translated from ${src_lang_name} into ${target_lang_name} by DeepL`;
}

function on_error(
	error: Error | string,
	span: HTMLElement,
	button_message: string = "Error while translating with DeepL"
) {
	// Log to console
	console.error(`Errored while translating with DeepL: ${error}`);
	// Clean up button stuff
	span.parentElement.onclick = null;
	span.parentElement.onmouseover = null;
	span.parentElement.onmouseout = null;
	span.style.textDecoration = "none";
	// Show error message on button
	span.innerText = button_message;
	span.style.color = "#ff0033";
}

(async () => {
	await add_deepl();
})();
