const constants = require('./constants.js');

module.exports = {
    add: (req, res) => render(res, 'add'),
    added: (req, res) => render(res, 'added', {
        name: req.body.name,
        month: constants.months[parseInt(req.body.month)-1],
        day: parseInt(req.body.day),
    }),
    error: (req, res) => render(res, 'error', {error: res.errorText}),
};

function render(res, view, options/*optional*/) {
    res.render(view, options || {}, (err, html) =>
        res.render('page', {content: html}));
}
