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
			secure: SECURE,
			logger: LOGGER,
			debug: DEBUG,
			secureConnection: SECURE_CONNECTION,
			auth: {
				user: EMAIL_USER,
				pass: EMAIL_PASSWORD,
			},
			tls: {
				rejectUnAuthorized: REJECT_UNAUTHORIZED,
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
