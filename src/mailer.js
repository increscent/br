const nodemailer = require('nodemailer');
const config = require('../config.json');

var transporter = nodemailer.createTransport({
    host: 'smtp.fastmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.smtp.username,
        pass: config.smtp.password,
    },
});

module.exports = {
    sendMail: async (to, subject, html) => {
        var info = await transporter.sendMail({
            from: `"${config.smtp.name}" <${config.smtp.username}>`,
            to,
            subject,
            html,
        });

        var numRecipients = to.split(',').length;
        return info.accepted.length == numRecipients;
    },
};
