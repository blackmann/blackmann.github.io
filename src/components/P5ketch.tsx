import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import clsx from "clsx";
import { EditorView, basicSetup } from "codemirror";
import * as babel from "prettier/plugins/babel.js";
import * as estree from "prettier/plugins/estree.js";
import prettier from "prettier/standalone";
import React from "react";
import "../styles/sketch-editor.css";

const template = `function setup() {

}

function draw() {

}
`;

function P5ketch() {
	const editorRef = React.useRef<HTMLDivElement>(null);
	const [editorView, setEditorView] = React.useState<EditorView>();

	const [applied, setApplied] = React.useState("");
	const [lastCode, setLastCode] = React.useState("");

	React.useEffect(() => {
		if (!editorRef.current) return;

		const saveToLocalStorage = EditorView.updateListener.of((update) => {
			if (!update.docChanged) {
				return;
			}

			const code = update.state.doc.toString();
			localStorage.setItem("last_code", code);
			setLastCode(code);
		});

		const saveKeybind = EditorView.domEventHandlers({
			keydown: (e) => {
				if ((e.metaKey || e.ctrlKey) && e.key === "s") {
					e.preventDefault();
					prettier
						.format(view.state.doc.toString(), {
							parser: "babel",
							plugins: [babel, estree],
						})
						.then((v) => {
							setLastCode(v);
							setApplied(v);

							const prevSelection = view.state.selection;

							view.dispatch({
								changes: {
									from: 0,
									to: view.state.doc.length,
									insert: v,
								},
							});

							try {
								view.dispatch({
									selection: prevSelection,
								});
							} catch {}
						});
				}
			},
		});

		const view = new EditorView({
			doc: template,
			extensions: [
				basicSetup,
				javascript(),
				keymap.of([indentWithTab]),
				saveToLocalStorage,
				saveKeybind,
			],
			parent: editorRef.current,
		});

		setEditorView(view);

		return () => view.destroy();
	}, []);

	React.useEffect(() => {
		if (!editorView) {
			return;
		}

		const lastCode = localStorage.getItem("last_code") || template;
		setApplied(lastCode);
		editorView.dispatch({
			changes: { from: 0, to: editorView.state.doc.length, insert: lastCode },
		});
	}, [editorView]);

	const hasChanges = applied !== lastCode;

	return (
		<div>
			<canvas className="block aspect-[16/7] w-full rounded-lg border" />

			<div className="grid grid-cols-1 md:grid-cols-3 mt-2">
				<div className="grid-cols-1 md:col-span-2">
					<div
						className={clsx(
							"h-[25rem] rounded-lg max-h-[25rem] overflow-y-scroll border",
							{ "!border-zinc-400": hasChanges },
						)}
						ref={editorRef}
					/>
				</div>

				<div className="col-span-1 " />
			</div>
		</div>
	);
}

export { P5ketch };
