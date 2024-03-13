import Queue from "bull";

const { REDIS_HOST, REDIS_PORT } = process.env;

const sendOtpMailQueue = new Queue("sendOtpMail", {
	redis: {
		host: REDIS_HOST,
		port: REDIS_PORT,
	},
});

const taskMailStatusQueue = new Queue("taskStatusMail", {
	redis: {
		host: REDIS_HOST,
		port: REDIS_PORT,
	},
});

const userQueue = new Queue("userQueue", {
	redis: {
		host: REDIS_HOST,
		port: REDIS_PORT,
	},
});

export { sendOtpMailQueue, taskMailStatusQueue , userQueue};
