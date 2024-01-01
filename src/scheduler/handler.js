import { sendMailQueue } from "./Scheduler.js";
import { AuthTemplate } from "../templates/OtpTemplate.js";
import { DeadLineTemplate } from "../templates/DeadLineTemplate.js";

const NewJobScheduler = async (req, res) => {
	const { notificationInfo, type, priority, delay, attempts } = req.body;

	if (!notificationInfo || !type || !priority) {
		return res
			.status(400)
			.send({ status: false, msg: "parameter missing." });
	}

	const data = {
		notificationInfo,
		type,
		priority,
	};

	const options = {
		delay: delay,
		attempts: attempts,
	};
	await sendMailQueue.add(data, options);
	res.status(200).send({
		status: true,
		msg: "notification scheduled successfull",
	});
};

sendMailQueue.process(async (job) => {
	try {
		const { notificationInfo, type, priority } = job.data;
		switch (type) {
			case "otp": {
				let mailOptions = {
					from: process.env.EMAIL_USER,
					to: notificationInfo.email,
					...AuthTemplate(notificationInfo),
				};
				await sendMail(mailOptions);
			}
			case "deadline": {
				notificationInfo.users.forEach(async (element) => {
					let mailOptions = {
						from: process.env.EMAIL_USER,
						to: element.email,
						...DeadLineTemplate(notificationInfo),
					};
					await sendMail(mailOptions);
				});
			}
			default:
				break;
		}
	} catch (error) {
		console.error("Error sending email:", error);
	}
});

function sendMail(mailOptions) {
	return new Promise((resolve, reject) => {
		let mailConfig = {
			service: "gmail",
			port: 465,
			secure: true,
			logger: false,
			debug: false,
			secureConnection: false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
			tls: {
				rejectUnAuthorized: true,
			},
		};
		nodemailer
			.createTransport(mailConfig)
			.sendMail(mailOptions, (err, info) => {
				if (err) {
					reject(err);
				} else {
					resolve(info);
				}
			});
	});
}

export { NewJobScheduler };
