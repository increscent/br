const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'br';

var readyCallbacks = [];
module.exports = {
    ready: (cb) => readyCallbacks.push(cb),
};

mongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    module.exports.client = client;
    module.exports.reminders = db.collection('reminders');

    for (var i = 0; i < readyCallbacks.length; i++)
        readyCallbacks[i]();
});
