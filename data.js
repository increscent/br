const uuid = require('uuid/v4');
const db = require('./db.js');

module.exports = {
    addReminder: (req, res, next) => {
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
                res.send(); // error

            next();
        });
    },
};
