const router = require('express').Router();
const views = require('./views.js');
const data = require('./data.js');

router.get('/view/add', views.add);

router.post('/reminder', data.addReminder, (req, res) => console.log(req.body));

module.exports = router;
