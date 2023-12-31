import express from 'express'
import schedule from 'node-schedule'
import Queue from 'bull';
import nodemailer from 'nodemailer';

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendMailQueue = new Queue('sendMail', {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        // password: 'root'
    }
});

app.post('/send-email', async (req, res) => {
    const email = req.body.email;
    const delay = req.body.delay;
    const attempts = req.body.attempts;
    if (!email || !delay || !delay) {
        return res.status(400).send('Email parameter is missing.');
    }
    const data = {
        email: email,
    };
    const options = {
        delay: delay,
        attempts: attempts,
    };
    await sendMailQueue.add(data, options);
    res.status(200).send('Email job added to the queue.');
});


sendMailQueue.process(async job => {
    try {
        await sendMail(job.data.email);
        console.log("working")
    } catch (error) {
        console.error('Error sending email:', error);
    }
});

function sendMail(email) {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Notification Generator',
            text: "This email is from custom notification scheduler.",
        };
        let mailConfig = {
            service: 'gmail',
            port: 465,
            secure: true,
            logger:false,
            debug:false,
            secureConnection:false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls:{
                rejectUnAuthorized:true
            }
        };
        nodemailer.createTransport(mailConfig).sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
}

app.listen(5000, () => {
    console.log("server running on port 5000")
})