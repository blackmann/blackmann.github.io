import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import clsx from "clsx";
import { EditorView, basicSetup } from "codemirror";
import p5 from "p5";
import * as babel from "prettier/plugins/babel.js";
import * as estree from "prettier/plugins/estree.js";
import prettier from "prettier/standalone";
import React from "react";
import "../styles/sketch-editor.css";

const CANVAS_BASE_WIDTH = 1080;
const TEMPLATE = `function setup() {}

function draw() {}
`;

function P5ketch() {
	const canvasRef = React.useRef<HTMLDivElement>(null);
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
			doc: TEMPLATE,
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

		const lastCode = localStorage.getItem("last_code") || TEMPLATE;
		setApplied(lastCode);
		editorView.dispatch({
			changes: { from: 0, to: editorView.state.doc.length, insert: lastCode },
		});
	}, [editorView]);

	React.useEffect(() => {
		try {
			let resize: () => void;
			let scale = 1;

			const p = new p5((sketch) => {
				sketch.grid = () => {
					sketch.push();
					sketch.stroke("#ddd");
					let x = 40;
					const h = (CANVAS_BASE_WIDTH * 7) / 16;
					while (x < CANVAS_BASE_WIDTH) {
						sketch.line(x, 0, x, h);


						sketch.push();

						sketch.fill("#aaa");
						sketch.noStroke();
						sketch.text(`${x / 40}`, x, 10);

						sketch.pop();

						x += 40;
					}

					let y = 40;
					while (y < h) {
						sketch.line(0, y, CANVAS_BASE_WIDTH, y);

						sketch.push();

						sketch.fill("#aaa");
						sketch.noStroke();
						sketch.textAlign(sketch.RIGHT, sketch.CENTER);
						sketch.text(`${y / 40}`, 35, y + 8);

						sketch.pop();

						y += 40;
					}

					sketch.pop();


				};

				const f = new Function("sketch", `${applied};return {draw, setup}`);
				const { setup, draw } = f(sketch);

				sketch.setup = () => {
					if (!canvasRef.current) return;

					const { clientHeight, clientWidth } = canvasRef.current;
					const canvas = sketch.createCanvas(clientWidth, clientHeight);

					scale = clientWidth / CANVAS_BASE_WIDTH;
					canvas.style.width = clientWidth;
					canvas.style.height = clientHeight;

					resize = () => {
						if (!canvasRef.current) return;

						const { clientHeight, clientWidth } = canvasRef.current;
						sketch.resizeCanvas(clientWidth, clientHeight);
						canvas.style.width = clientWidth;
						canvas.style.height = clientHeight;

						scale = clientWidth / CANVAS_BASE_WIDTH;
					};

					window.addEventListener("resize", resize);

					setup();
				};

				sketch.draw = () => {
					sketch.scale(scale);
					draw();
				};
			}, canvasRef.current);

			return () => {
				p.remove();
				window.removeEventListener("resize", resize);
			};
		} catch (err) {
			console.error(err);
		}
	}, [applied]);

	const hasChanges = applied !== lastCode;

	return (
		<div>
			<div
				className="block aspect-[16/7] w-full rounded-lg border overflow-hidden"
				ref={canvasRef}
			/>

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
