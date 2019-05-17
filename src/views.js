const constants = require('./constants.js');

module.exports = {
    add: (req, res) => render(res, 'add'),
    added: remindersView('added'),
    get: (req, res) => render(res, 'get'),
    gotten: (req, res) => {
        if (res.success)
            render(res, 'gotten');
        else
            res.error('We failed to send you an email.');
    },
    removed: remindersView('removed'),
    error: (req, res) => render(res, 'error', {error: res.errorText}),
};

function remindersView(added_or_removed) {
    return (req, res) => {
        var options = {actionToken: res.actionToken};
        var reminders = res.reminders.map(x => ({
            ...x,
            month: constants.months[x.month-1]
        }));

        if (reminders.length == 0) {
            res.error(`No reminders were ${added_or_removed}.`);
        } else if (reminders.length == 1) {
            render(res, `${added_or_removed}_one`, {
                ...options,
                ...reminders[0],
            });
        } else {
            render(res, `${added_or_removed}_many`, {
                ...options,
                reminders,
            });
        }
    };
}

function render(res, view, options/*optional*/) {
    res.render(view, options || {}, (err, html) =>
        res.render('page', {content: html}));
}
