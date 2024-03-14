import jwt from "jsonwebtoken";
import { userQueue } from "../components/scheduler.js";
import { sendMail } from "../components/node-mailer.js";
import { queryDatabase } from "../db/queryDb.js";
import { PasswordReset } from "../templates/password-reset.js";
import { WelcomeUser } from "../templates/welcome-mail.js";

const genToken = (data) => {
	const secretKey = "your_secret_key";
	return jwt.sign(data, secretKey, { expiresIn: "3h" });
};

const UserPassword = async (req, res) => {
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
		data["token"] = genToken(data);
		await userQueue.add(data, options);
		res.status(200).send({
			status: true,
			msg: "notification scheduled successfull",
		});
	} catch (error) {
		console.error(error);
		res.status(500).send({
			status: false,
			msg: "notification scheduled failed",
		});
	}
};

const NewOrganization = async (req, res) => {
	const data = req.body;
	const query = {
		name: "get-user_info_org",
		text: "select u.user_name, u.email_addrs, o.name from user_info u join organization o on o.organization_id = u.organization_id  where user_id = $1",
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
		data["type"] = "NEW_ORG";
		await userQueue.add(data, options);
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

userQueue.process(async (job) => {
	try {
		switch (job.data.type) {
			case "PASSWORD": {
				let mailOptions = {
					from: process.env.EMAIL_USER,
					to: job.data.email_addrs,
					...PasswordReset(job.data),
				};
				await sendMail(mailOptions);
				break;
			}

			case "NEW_ORG": {
				let mailOptions = {
					from: process.env.EMAIL_USER,
					to: job.data.email_addrs,
					...WelcomeUser(job.data),
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

export { UserPassword, NewOrganization };
