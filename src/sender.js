const mustache = require('mustache');
const constants = require('./constants.js');
const config = require('../config.json');
const fs = require('fs');
const mailer = require('./mailer.js');

const reminderSubject = fs.readFileSync(`${__dirname}/views/reminder_subject.mustache`).toString();
const reminderBody = fs.readFileSync(`${__dirname}/views/reminder_body.mustache`).toString();
const remindersSubject = fs.readFileSync(`${__dirname}/views/reminders_subject.mustache`).toString();
const remindersBody = fs.readFileSync(`${__dirname}/views/reminders_body.mustache`).toString();

module.exports = {
    sendReminder: async (reminder, date) => {
        var data = {
            ...reminder,
            month: constants.months[date.getMonth()],
            dayOfWeek: constants.days[date.getDay()],
            baseUrl: config.baseUrl,
        };

        var subject = mustache.render(reminderSubject, data);
        var html = mustache.render(reminderBody, data);
        
        return await mailer.sendMail(reminder.email, subject, html);
    },
    sendReminders: async (req, res, next) => {
        var data = {
            reminders: res.reminders.map(x => ({
                ...x,
                month: constants.months[x.month-1]}
            )),
            email: res.email,
            baseUrl: config.baseUrl,
        };

        var subject = mustache.render(remindersSubject, data);
        var html = mustache.render(remindersBody, data);

        res.success = await mailer.sendMail(data.email, subject, html);

        next();
    },
};
