const nodemailer = require('nodemailer');

function mailTransporter(activeEmail) {
    return nodemailer.createTransport({
        host: process.env.MAIL_SMTP_HOST,
        port: process.env.MAIL_SMTP_PORT,
        secure: true,
        auth: {
            user: activeEmail.email,
            pass: activeEmail.password,
        },
    });
}

module.exports = {
    mailTransporter
}