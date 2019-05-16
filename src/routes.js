const router = require('express').Router();
const views = require('./views.js');
const data = require('./data.js');

router.get('/', redirectTo('/view/add'));
router.get('/view/add', views.add);

router.post('/reminder', data.addReminder, views.added);

router.get('/delete/reminder', data.removeReminder, views.removed);
router.get('/delete/reminder/all', data.removeReminder, views.removed);

router.get('/undo/:actionToken', data.undo);

module.exports = router;

function redirectTo(path) {
    return (req, res) => res.redirect(path);
}
