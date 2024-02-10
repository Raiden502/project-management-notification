import { sendOtpMailQueue } from "../components/Scheduler.js";
import { sendMail } from "../components/NodeMailer.js";
import { AuthTemplate } from "../templates/OtpTemplate.js";

const taskJobScheduler = async (req, res) => {
	const data = req.body;
	if (!data) {
		return res
			.status(400)
			.send({ status: false, msg: "parameter missing." });
	}
	const options = {};
	await sendOtpMailQueue.add(data, options);
	res.status(200).send({
		status: true,
		msg: "notification scheduled successfull",
	});
};

sendOtpMailQueue.process(async (job) => {
	try {
		const { otp, email } = job.data;
		let mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			...AuthTemplate(otp),
		};
		await sendMail(mailOptions);
	} catch (error) {
		console.error("Error sending email:", error);
	}
});

export { taskJobScheduler };
