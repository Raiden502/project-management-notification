import { queryDatabase } from "../db/queryDb.js";
import { taskMailStatusQueue } from "../components/scheduler.js";
import { sendMail } from "../components/node-mailer.js";
import { NewDepartment } from "../templates/new-department.js";
import { NewProject } from "../templates/new-project.js";
import { NewTask } from "../templates/new-task.js";
import { DeadLineTemplate } from "../templates/deadline.js";

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
		text: `SELECT 
				p.name as projectname,
				u.user_name as user , 
				u.email_addrs, 
				ty.name as taskstatus, 
				t.name as task,
				t.priority as priority,
				r.user_name as reporter
			FROM tasks t
			LEFT JOIN task_user_association tu ON tu.task_id = t.task_id
			left join projects_info p on p.project_id = t.project_id
			LEFT JOIN user_info u ON u.user_id = tu.user_id
			LEFT JOIN task_types ty on ty.type_id = t.type_id
			LEFT JOIN user_info r on r.user_id = t.reporter
			WHERE tu.user_id =  ANY($1::TEXT[])
			and p.project_id = $2
			and t.task_id = $3;
	`,
		values: [data.user_list, data.project_id, data.task_id],
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
		user_info.forEach(async (data) => {
			data["type"] = "NEW_TASK";
			await taskMailStatusQueue.add(data, options);
		});
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
		text: `select d.name as dept_name, u.user_name as user , u.email_addrs from department_info d 
				left join dept_user_associaton du on du.department_id = d.department_id
				left join user_info u on u.user_id = du.user_id
				where u.user_id = ANY($1::TEXT[])`,
		values: [data.user_list],
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

		user_info.forEach(async (data) => {
			data["type"] = "NEW_DEPT";
			await taskMailStatusQueue.add(data, options);
		});

		res.status(200).send({
			status: true,
			msg: "notification scheduled successfull",
		});
	} catch (error) {
		console.error("error unable to insert", error);
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
		text: `SELECT p.name as projectname, u.user_name as user , u.email_addrs
				FROM projects_info p 
				LEFT JOIN project_user_association pu ON pu.project_id = p.project_id
				LEFT JOIN user_info u ON u.user_id = pu.user_id
				WHERE u.user_id = ANY($1::TEXT[])  and p.project_id = $2;`,
		values: [data.user_list, data.project_id],
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
		user_info.forEach(async (data) => {
			data["type"] = "NEW_PROJECT";
			await taskMailStatusQueue.add(data, options);
		});
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
