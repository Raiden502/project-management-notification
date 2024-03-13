import { Router } from "express";
import {
	TaskUpdateScheduler,
	NewDepartmentScheduler,
	NewProjectScheduler,
	NewTaskScheduler,
} from "./task-handler.js";
import { UserPassword, NewOrganization } from "./password-handler.js";

const router = Router();

router.post("/send-status-mail", TaskUpdateScheduler);
router.post("/send-dept-mail", NewDepartmentScheduler);
router.post("/send-task-mail", NewTaskScheduler);
router.post("/send-project-mail", NewProjectScheduler);
router.post("/send-user-password", UserPassword);
router.post("/new-organization", NewOrganization);

export { router };
