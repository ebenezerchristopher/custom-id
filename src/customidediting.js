import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class CustomIdEditing extends Plugin {
	init() {
		this._defineSchema();
		this._defineConverters();
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		// Extend the text node's schema to accept the divWithId attribute.
		schema.extend("$text", {
			allowAttributes: ["sectionWithId"],
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		conversion.for("downcast").attributeToElement({
			model: "sectionWithId",
			// Callback function provides access to the model attribute value
			// and the DowncastWriter.
			view: (modelAttributeValue, conversionApi) => {
				const { writer } = conversionApi;

				return writer.createAttributeElement("section", {
					id: modelAttributeValue,
					"data-sectionWithId": true,
					style: "display: inline-block;",
				});
			},
		});

		// Conversion from a view element to a model attribute.
		conversion.for("upcast").elementToAttribute({
			view: {
				name: "section",
				attributes: ["id", "data-sectionWithId"],
			},
			model: {
				key: "sectionWithId",
				// Callback function provides access to the view element.
				value: (viewElement) => {
					const id = viewElement.getAttribute("id");

					return id;
				},
			},
		});
	}
}
