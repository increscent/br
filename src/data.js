const uuid = require('uuid/v4');
const db = require('./db.js');
const validator = require('validator');
const constants = require('./constants.js');

module.exports = {
    addReminder: (req, res, next) => {
        if (!validateReminderRequestBody(req, res))
            return;

        var reminder = {
            token: uuid().replace(/-/g, ''),
            name: req.body.name,
            month: parseInt(req.body.month),
            day: parseInt(req.body.day),
            email: req.body.email,
            yearSent: 0,
        };

        db.reminders.insertMany([reminder], (err, result) => {
            if (err)
                return res.error('We failed to save the reminder to the database.');

            next();
        });
    },
};

function validateReminderRequestBody(req, res) {
    if (!req.body.name)
        return res.error('You must include a name with the birthday reminder.') && false;

    var month = parseInt(req.body.month);
    if (!month || month < 1 || month > 12)
        return res.error('You must choose a month for the birthday reminder.') && false;

    var day = parseInt(req.body.day);
    if (!day || day < 1 || day > constants.monthDays[month-1])
        return res.error('You must choose a day for the birthday reminder.') && false;

    if (!validator.isEmail(req.body.email))
        return res.error('You must include a valid email with the birthday reminder.') && false;

    return true;
}
