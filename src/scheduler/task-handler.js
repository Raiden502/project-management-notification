import { taskMailStatusQueue } from "../components/scheduler.js";
import { sendMail } from "../components/node-mailer.js";
import { NewDepartment } from "../templates/new-department.js";
import { NewProject } from "../templates/new-project.js";
import { NewTask } from "../templates/new-task.js";
import {DeadLineTemplate} from '../templates/deadline.js';

const TaskUpdateScheduler = async (req, res) => {
	const data = req.body;
	const query = {
		name: "get-user_info",
		text: "select user_id, user_name, email_addrs from user_info where user_id = $1",
		values: [data.user_id],
	};

	const options = {
		lifo: true,
	};
	try {
		const user_info = await queryDatabase(query);
		if (user_info.length < 1) {
			res.status(200).send({
				status: false,
				msg: "user not available",
			});
		}
		const data = user_info[0];
		data["type"] = "PASSWORD";
		await taskMailStatusQueue.add(data, options);
		res.status(200).send({
			status: true,
			msg: "notification scheduled successfull",
		});
	} catch (error) {
		console.error("error unable to insert");
		res.status(500).send({
			status: false,
			msg: "notification scheduled failed",
		});
	}
};

const NewTaskScheduler = async (req, res) => {
	const data = req.body;
	const query = {
		name: "get-user_info",
		text: "select user_id, user_name, email_addrs from user_info where user_id = $1",
		values: [data.user_id],
	};

	const options = {
		lifo: true,
	};

	try {
		const user_info = await queryDatabase(query);
		if (user_info.length < 1) {
			res.status(200).send({
				status: false,
				msg: "user not available",
			});
		}
		const data = user_info[0];
		data["type"] = "PASSWORD";
		await taskMailStatusQueue.add(data, options);
		res.status(200).send({
			status: true,
			msg: "notification scheduled successfull",
		});
	} catch (error) {
		console.error("error unable to insert");
		res.status(500).send({
			status: false,
			msg: "notification scheduled failed",
		});
	}
};

const NewDepartmentScheduler = async (req, res) => {
	const data = req.body;
	const query = {
		name: "get-user_info",
		text: "select user_id, user_name, email_addrs from user_info where user_id = $1",
		values: [data.user_id],
	};

	const options = {
		lifo: true,
	};

	try {
		const user_info = await queryDatabase(query);
		if (user_info.length < 1) {
			res.status(200).send({
				status: false,
				msg: "user not available",
			});
		}
		const data = user_info[0];
		data["type"] = "PASSWORD";
		await taskMailStatusQueue.add(data, options);
		res.status(200).send({
			status: true,
			msg: "notification scheduled successfull",
		});
	} catch (error) {
		console.error("error unable to insert");
		res.status(500).send({
			status: false,
			msg: "notification scheduled failed",
		});
	}
};

const NewProjectScheduler = async (req, res) => {
	const data = req.body;
	const query = {
		name: "get-user_info",
		text: "select user_id, user_name, email_addrs from user_info where user_id = $1",
		values: [data.user_id],
	};

	const options = {
		lifo: true,
	};

	try {
		const user_info = await queryDatabase(query);
		if (user_info.length < 1) {
			res.status(200).send({
				status: false,
				msg: "user not available",
			});
		}
		const data = user_info[0];
		data["type"] = "PASSWORD";
		await taskMailStatusQueue.add(data, options);
		res.status(200).send({
			status: true,
			msg: "notification scheduled successfull",
		});
	} catch (error) {
		console.error("error unable to insert");
		res.status(500).send({
			status: false,
			msg: "notification scheduled failed",
		});
	}
};

taskMailStatusQueue.process(async (job) => {
	try {
		switch (job.data.type) {
			case "NEW_DEPT": {
				let mailOptions = {
					from: process.env.EMAIL_USER,
					to: job.data.email_addrs,
					...NewDepartment(job.data),
				};
				await sendMail(mailOptions);
				break;
			}

			case "NEW_PROJECT": {
				let mailOptions = {
					from: process.env.EMAIL_USER,
					to: job.data.email_addrs,
					...NewProject(job.data),
				};
				await sendMail(mailOptions);
				break;
			}

			case "NEW_TASK": {
				let mailOptions = {
					from: process.env.EMAIL_USER,
					to: job.data.email_addrs,
					...NewTask(job.data),
				};
				await sendMail(mailOptions);
				break;
			}

			case "NEW_UPDATE": {
				let mailOptions = {
					from: process.env.EMAIL_USER,
					to: job.data.email_addrs,
					...DeadLineTemplate(job.data),
				};
				await sendMail(mailOptions);
				break;
			}

			default:
				console.log("unkown type");
				break;
		}
	} catch (error) {
		console.error("Error sending email:", error);
	}
});

export {
	TaskUpdateScheduler,
	NewDepartmentScheduler,
	NewProjectScheduler,
	NewTaskScheduler,
};
