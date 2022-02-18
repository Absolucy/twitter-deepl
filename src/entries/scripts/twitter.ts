import { get_element } from "./get_element";
import { TWEET, TRANSLATE_TWEET } from "./selectors";
import { get } from "./storage";

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
		console.log("no tweets found");
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
		console.log("no translate button found");
		return;
	}
	let new_translate_button = create_new_translate_button(translate_button);
	translate_button.parentElement.after(new_translate_button);
	// Remove the old translate button.
	translate_button.parentElement.remove();
}

function create_new_translate_button(copycat: HTMLElement): HTMLElement {
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

	// Get a reference to the original tweet
	let tweet_reference = copycat.parentElement.previousElementSibling
		.firstChild as HTMLElement;

	// Set up click handler
	div.onclick = () => {
		deepl_translate(tweet_reference, span);
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

interface DeepLResponse {
	text: string;
	detected_source_language: string;
}

async function deepl_translate(tweet: HTMLElement, span: HTMLElement) {
	let target_language: string = (await get("target_language")) || "EN-US";
	let api_key: string = (await get("api_key")) || "";
	let form_data = new FormData();
	form_data.append("auth_key", api_key);
	form_data.append("text", tweet.innerText);
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
		tweet.innerText = response.text;
	} catch (error) {
		on_error(error, span);
		return;
	}

	span.parentElement.onclick = null;
	span.parentElement.onmouseover = null;
	span.parentElement.onmouseout = null;
	span.style.textDecoration = "none";

	let src_lang_name = LANGUAGE_NAMES[response.detected_source_language];
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

window.addEventListener("load", () => {
	(async () => {
		console.log("running");
		await add_deepl();
		console.log("done");
	})();
});
