import Queue from "bull";

const sendOtpMailQueue = new Queue("sendOtpMail", {
	redis: {
		host: "127.0.0.1",
		port: 6379,
	},
});

const taskMailStatusQueue = new Queue("taskStatusMail", {
	redis: {
		host: "127.0.0.1",
		port: 6379,
	},
});

export { sendOtpMailQueue, taskMailStatusQueue };
