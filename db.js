const mongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'br';

module.exports = {};

mongoClient.connect(url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    module.exports.reminders = db.collection('reminders');
});
