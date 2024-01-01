import nodemailer from 'nodemailer';

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

export {sendMail}