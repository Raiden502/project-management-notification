import Queue from "bull";

const sendMailQueue = new Queue("sendMail", {
	redis: {
		host: "127.0.0.1",
		port: 6379,
		// password: 'root'
	},
});

export { sendMailQueue };
