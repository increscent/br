const uuid = require('uuid/v4');
const db = require('./db.js');
const validator = require('validator');
const constants = require('./constants.js');
const views = require('./views.js');

module.exports = {
    addReminder: (req, res, next) => {
        if (!validateReminderRequestBody(req, res))
            return;

        var reminder = {
            token: getToken(),
            name: req.body.name,
            month: parseInt(req.body.month),
            day: parseInt(req.body.day),
            email: req.body.email,
            yearSent: 0,
        };
        
        addReminders([reminder], req, res, next);
    },
    removeReminder: (req, res, next) => {
        var tokens = req.query.token ? [req.query.token] : null;
        removeReminders([tokens, req.query.email], req, res, next);
    },
    getReminders: (req, res, next) => {
        var email = req.body.email;

        db.reminders.find({email}).toArray((err, data) => {
            if (err || !data.length)
                return res.error('We couldn\'t find any Birthday Reminders for that email.');

            res.reminders = data;
            res.email = email;

            next();
        });
    },
    undo: (req, res, next) => {
        var actionToken = req.params.actionToken;

        db.actions.findOne({token: actionToken}, (err, action) => {
            if (err)
                return res.error('We failed to undo your changes. Sorry about that :/');
            if (action.undone)
                return res.error('You already undid this action. No need to worry.');

            if (action.name == 'removeReminders') {
                addReminders(action.data, req, res, () =>
                    views.added(req, res));
            } else if (action.name == 'addReminders') {
                removeReminders([action.data.map(x => x.token), null], req, res, () =>
                    views.removed(req, res));
            } else {
                res.error('We failed to undo your changes. Sorry about that :/');
            }

            db.actions.updateOne({token: actionToken}, {$set: {undone: true}});
        });
    },
};

function addReminders(reminders, req, res, next) {
    db.reminders.insertMany(reminders, (err, result) => {
        if (err)
            return res.error('We failed to save the reminder(s) to the database.');

        var addedReminders = result.ops;

        res.actionToken = logAction('addReminders', addedReminders);
        res.reminders = addedReminders;

        next();
    });
}

function removeReminders([tokens, email], req, res, next) {
    var query = {email};
    if (tokens)
        query = {token: {$in: tokens}};

    db.reminders.find(query).toArray((err, reminders) => {
        db.reminders.deleteMany(query, (err, result) => {
            if (err)
                return res.error('We failed to remove the reminder(s) from the database.');

            res.actionToken = logAction('removeReminders', reminders);
            res.reminders = reminders;

            next();
        });
    });
}

function logAction(name, data) {
    var action = {
        name,
        data,
        date: new Date(),
        token: getToken(),
        undone: false,
    };

    db.actions.insertMany([action]);

    return action.token;
}

function getToken() {
    return uuid().replace(/-/g, '');
}

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
