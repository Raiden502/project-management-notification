import express from "express";
import { router } from "./scheduler/Urls.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.listen(5000, () => {
	console.log("server running on port 5000");
});
