import nodemailer from "nodemailer";

const {
	SERVICE,
	SERVICE_PORT,
	SECURE,
	LOGGER,
	DEBUG,
	EMAIL_USER,
	EMAIL_PASSWORD,
	SECURE_CONNECTION,
	REJECT_UNAUTHORIZED,
} = process.env;

function sendMail(mailOptions) {
	return new Promise((resolve, reject) => {
		let mailConfig = {
			service: SERVICE,
			port: SERVICE_PORT,
			secure: true,
			logger: false,
			debug: false,
			secureConnection: false,
			auth: {
				user: EMAIL_USER,
				pass: EMAIL_PASSWORD,
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

export { sendMail };
