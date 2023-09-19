import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
	ButtonView,
	ContextualBalloon,
	clickOutsideHandler,
} from "@ckeditor/ckeditor5-ui";
import { first } from "@ckeditor/ckeditor5-utils";
import "../customid-styles.css";
import FormView from "./customidview";

export default class CustomIduI extends Plugin {
	static get requires() {
		return [ContextualBalloon];
	}

	init() {
		const editor = this.editor;

		this._balloon = this.editor.plugins.get(ContextualBalloon);
		this.formView = this._createFormView();

		editor.ui.componentFactory.add("for-link", () => {
			const button = new ButtonView();

			button.label = "Insert id";
			button.tooltip = true;
			button.withText = true;

			this.listenTo(button, "execute", () => {
				this._showUI();
			});

			return button;
		});
	}

	_createFormView() {
		const editor = this.editor;
		const formView = new FormView(editor.locale);

		this.listenTo(formView, "submit", () => {
			const selection = editor.model.document.selection;

			const id = formView.idInputField.fieldView.element.value;

			const parentElement = first(selection.getSelectedBlocks());

			console.log(Array.from(selection.getSelectedBlocks()), "parentElement");

			const element = first(parentElement?.getChildren());

			editor.model.change((writer) => {
				if (element) {
					writer.setAttribute("sectionWithId", id, element);
				} else if (parentElement.name === "imageBlock") {
					writer.setAttribute("sectionWithId", id, parentElement);
				} else {
					return;
				}
			});

			// Hide the form view after submit.
			this._hideUI();
		});

		// Hide the form view after clicking the "Cancel" button.
		this.listenTo(formView, "cancel", () => {
			this._hideUI();
		});

		// Hide the form view when clicking outside the balloon.
		clickOutsideHandler({
			emitter: formView,
			activator: () => this._balloon.visibleView === formView,
			contextElements: [this._balloon.view.element],
			callback: () => this._hideUI(),
		});

		return formView;
	}

	_hideUI() {
		this.formView.idInputField.fieldView.value = "";

		this.formView.element.reset();

		this._balloon.remove(this.formView);

		// Focus the editing view after closing the form view.
		this.editor.editing.view.focus();
	}

	_getBalloonPositionData() {
		const view = this.editor.editing.view;
		const viewDocument = view.document;
		let target = null;

		// Set a target position by converting view selection range to DOM.
		target = () =>
			view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

		return {
			target,
		};
	}

	_showUI() {
		this._balloon.add({
			view: this.formView,
			position: this._getBalloonPositionData(),
		});

		this.formView.focus();
	}
}
