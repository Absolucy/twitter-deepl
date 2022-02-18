import { get, set } from "../scripts/storage";

const SUPPORTED_LANGUAGES = [
	"EN-US",
	"EN-GB",
	"BG",
	"CS",
	"DA",
	"DE",
	"EL",
	"ES",
	"ET",
	"FI",
	"FR",
	"HU",
	"IT",
	"JA",
	"LT",
	"LV",
	"NL",
	"PL",
	"PT-PT",
	"PT-BR",
	"RO",
	"RU",
	"SK",
	"SL",
	"SV",
	"ZH",
];
const SUPPORTED_FORMALITIES = ["default", "more", "less"];

function assert_string_to_list(
	string: any,
	list: Array<string>,
	default_value: string
): string {
	return typeof string === "string" && list.includes(string)
		? string
		: default_value;
}

function assert_string(string: any, default_value: string = ""): string {
	return typeof string === "string" ? string : default_value;
}

function save_options() {
	console.log("Saving!");
	// Let's do some basic sanity checks
	let target_language_form: HTMLSelectElement =
		document.querySelector("#target-language");
	let target_language = assert_string_to_list(
		target_language_form.value,
		SUPPORTED_LANGUAGES,
		"EN-US"
	);
	let formality_form: HTMLSelectElement = document.querySelector("#formality");
	let formality = assert_string_to_list(
		formality_form.value,
		SUPPORTED_FORMALITIES,
		"default"
	);
	let split_sentences_form: HTMLInputElement =
		document.querySelector("#split-sentences");
	let preserve_formatting_form: HTMLInputElement = document.querySelector(
		"#preserve-formatting"
	);
	let api_key_form: HTMLInputElement = document.querySelector("#api-key");
	set({
		api_key: assert_string(api_key_form.value),
		target_language,
		split_sentences: split_sentences_form.checked,
		preserve_formatting: preserve_formatting_form.checked,
		formality,
	});
}

async function restore_options() {
	console.log("Loading!");
	let api_key_form: HTMLInputElement = document.querySelector("#api-key");
	let target_language_form: HTMLSelectElement =
		document.querySelector("#target-language");
	let split_sentences_form: HTMLInputElement =
		document.querySelector("#split-sentences");
	let preserve_formatting_form: HTMLInputElement = document.querySelector(
		"#preserve-formatting"
	);
	let formality_form: HTMLSelectElement = document.querySelector("#formality");
	api_key_form.value = assert_string(await get("api_key"));
	target_language_form.value = assert_string_to_list(
		await get("target_language"),
		SUPPORTED_LANGUAGES,
		"EN-US"
	);
	split_sentences_form.checked = (await get("split_sentences")) ?? true;
	preserve_formatting_form.checked =
		(await get("preserve_formatting")) ?? false;
	formality_form.value = assert_string_to_list(
		await get("formality"),
		SUPPORTED_FORMALITIES,
		"default"
	);
}

document.addEventListener("DOMContentLoaded", () => {
	document.querySelector("#form").addEventListener("change", () => {
		save_options();
	});
	restore_options();
});
