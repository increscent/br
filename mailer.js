const nodemailer = require('nodemailer');
const mustache = require('mustache');
const db = require('./src/db.js');
const constants = require('./src/constants.js');
const config = require('./config.json');
const fs = require('fs');
const emailSubjectTemplate = fs.readFileSync('./src/views/reminder_subject.mustache').toString();
const emailBodyTemplate = fs.readFileSync('./src/views/reminder_body.mustache').toString();


var transporter = nodemailer.createTransport({
    host: 'smtp.fastmail.com',
    port: 465,
    secure: true,
    auth: {
        user: config.smtp.username,
        pass: config.smtp.password,
    },
});


async function main() {
    for (var i = 0; i <= 3; i++) {
        var date = new Date();
        date.setDate(date.getDate()+i);
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();
        var dayOfWeek = constants.days[date.getDay()];

        query = {
            month,
            day,
            yearSent: {$lt: year},
        };

        var result = new Promise((resolve, reject) => {
            db.reminders.find(query)
                .toArray((err, data) => resolve([err, data]));
        });

        var [err, reminders] = await result;

        if (err)
            continue;

        for (var j = 0; j < reminders.length; j++) {
            var reminder = reminders[j];

            var data = {
                ...reminder,
                month: constants.months[month-1],
                dayOfWeek,
                baseUrl: config.baseUrl,
            };

            let info = await transporter.sendMail({
                from: `"${config.smtp.name}" <${config.smtp.username}>`,
                to: reminder.email,
                subject: mustache.render(emailSubjectTemplate, data),
                html: mustache.render(emailBodyTemplate, data),
            });

            if (info.accepted.length == 1) {
                console.log(`Sent reminder (${reminder.token}) to ${reminder.email}.`);

                await new Promise((resolve, reject) => {
                    db.reminders.updateOne({_id: reminder._id}, {$set: {yearSent: year}},
                        (err, data) => resolve(err, data));
                });
            } else {
                console.log(`Failed to send reminder (${reminder.token}) to ${reminder.email}.`);
            }
        }
    }
}

db.ready(async () => {
    await main()
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
    process.exit();
});
