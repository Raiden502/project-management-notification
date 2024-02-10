import express from "express";
import { router } from "./scheduler/Urls.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);


const { PORT, HOST } = process.env;

app.listen(PORT, HOST, () => {
	console.log("Server listening on port", PORT);
});
