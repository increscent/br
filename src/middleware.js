const views = require('./views.js');

module.exports = {
    error: (req, res, next) => {
        res.error = (errorText) => {
            res.errorText = errorText;
            views.error(req, res);
        };
        next();
    },
};
