import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import CustomIduI from "./customidui";
import CustomIdEditing from "./customidediting";

export default class CustomId extends Plugin {
	static get requires() {
		return [CustomIduI, CustomIdEditing];
	}
}
