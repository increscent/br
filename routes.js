const router = require('express').Router();
const views = require('./views.js');

router.get('/view/add', views.add);

router.post('/reminder', (req, res) => console.log(req.body));

module.exports = router;
