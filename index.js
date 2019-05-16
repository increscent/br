const app = require('express')();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const port = 9888;
const routes = require('./src/routes.js');
const middleware = require('./src/middleware.js');
const mailer = require('./mailer.js');

app.engine('mustache', mustacheExpress());
app.set('views', './src/views');
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middleware.error);
app.use('/', routes);

app.listen(port, () => 
    console.log(`Birthday Reminders server listening on port ${port}!`));

setInterval(mailer, 1000 * 60 * 5);
