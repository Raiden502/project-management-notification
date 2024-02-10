import { taskMailStatusQueue } from "../components/Scheduler.js";
import { sendMail } from "../components/NodeMailer.js";
import { DeadLineTemplate } from "../templates/DeadLineTemplate.js";

const statusJobScheduler = async (req, res) => {
	const { notificationInfo, delay, attempts } = req.body;

	if (!notificationInfo) {
		return res
			.status(400)
			.send({ status: false, msg: "parameter missing." });
	}

	const data = {
		notificationInfo,
	};

	const options = {
		delay: delay,
		attempts: attempts,
	};
	await taskMailStatusQueue.add(data, options);
	res.status(200).send({
		status: true,
		msg: "notification scheduled successfull",
	});
};

taskMailStatusQueue.process(async (job) => {
	try {
		const { notificationInfo } = job.data;

		notificationInfo.users.forEach(async (user) => {
			let mailOptions = {
				from: process.env.EMAIL_USER,
				to: user,
				...DeadLineTemplate(notificationInfo),
			};
			await sendMail(mailOptions);
		});
	} catch (error) {
		console.error("Error sending email:", error);
	}
});

export { statusJobScheduler };
