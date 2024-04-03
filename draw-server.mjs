import express from "express";
import cors from "cors";
import fs from "node:fs";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
	next();

	console.log(res.statusCode, req.path);
});

app.post("/draw/:fn", (req, res) => {
	const data = req.body;

	try {
		fs.mkdirSync("./public/drawings/");
	} catch {}

	fs.writeFileSync(
		`./public/drawings/${req.params.fn}.json`,
		JSON.stringify(data, null, 2),
		{ encoding: "utf-8" },
	);

	res.json({});
});

app.listen(4444, () => console.log("App live on ::4444"));
