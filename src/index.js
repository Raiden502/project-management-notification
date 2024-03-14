import express from "express";
import { router } from "./scheduler/urls.js";
import os from "os";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || "8083";

app.listen(PORT, HOST, () => {
	if (HOST === "0.0.0.0") {
		console.log(`Server listening on local: http://127.0.0.1:${PORT}`);
		const networkInterfaces = os.networkInterfaces();
		Object.keys(networkInterfaces).forEach((ifaceName) => {
			networkInterfaces[ifaceName].forEach((address) => {
				if (address.family === "IPv4" && !address.internal) {
					console.log(
						`Potential server address: http://${address.address}:${PORT}`
					);
				}
			});
		});
	} else {
		const address = `http://${HOST}:${PORT}`;
		console.log(`Server listening on address: ${address}`);
	}
});
