const nodemailer = require('nodemailer');
const mustache = require('mustache');
const db = require('./src/db.js');
const constants = require('./src/constants.js');
const config = require('./config.json');

var today = new Date();
var day = today.getDate();
var month = today.getMonth()+1;
var year = today.getFullYear();

var queries = [];

// TODO: just add one to the date and then recalculate day, month, year stuff

query = {
    month,
    day: {$lte: day+3, $gte: day},
    yearSent: {$lt: year},
};

db.ready(() => {
    db.reminders.find(query).toArray((err, data) => {
        console.log(data);
        db.client.close();
    });
});

async function main() {
    var transporter = nodemailer.createTransport({
        host: 'smtp.fastmail.com',
        port: 465,
        secure: true,
        auth: {
            user: config.smtp.username,
            pass: config.smtp.password,
        },
    });

    let info = await transporter.sendMail({
        from: `"Birthday Reminders" <${config.smtp.username}>`,
        to: 'robert@increscent.org',
        subject: 'Devan has a birthday December 22',
        html: '<p>Here\'s a friendly reminder that Devan has a birthday on Wednesday, December 22</p>',
    });

    console.log(info);

    process.exit();
}

//main();
