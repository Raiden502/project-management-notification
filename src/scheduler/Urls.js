import { Router } from "express";
import { NewJobScheduler } from "./handler.js";

const router = Router();

router.post("/send-mail", NewJobScheduler);

export { router };
