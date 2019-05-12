const app = require('express')();
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const port = 9888;
const routes = require('./routes.js');

app.engine('mustache', mustacheExpress());
if (process.env.NODE_ENV == 'development')
    app.disable('view cache');
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(port, () => 
    console.log(`Birthday Reminders server listening on port ${port}!`));
