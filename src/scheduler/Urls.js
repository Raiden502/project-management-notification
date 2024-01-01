import { Router } from "express";
import { optJobScheduler } from "./OtpHandler.js";
import { statusJobScheduler } from "./StatusHandler.js";

const router = Router();

router.post("/send-otp-mail", optJobScheduler);
router.post("/send-status-mail", statusJobScheduler);

export { router };
