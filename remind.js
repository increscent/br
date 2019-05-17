const sender = require('./src/sender.js');
const db = require('./src/db.js');

async function main() {
    for (var i = 0; i <= 3; i++) {
        var date = new Date();
        date.setDate(date.getDate()+i);
        var day = date.getDate();
        var month = date.getMonth()+1;
        var year = date.getFullYear();

        query = {
            month,
            day,
            yearSent: {$lt: year},
        };

        // always include February 29
        if (month == 2 && day == 28) {
            query = {
                month,
                $or: [{day: 28}, {day: 29}],
                yearSent: {$lt: year},
            };
        }

        var result = new Promise((resolve, reject) => {
            db.reminders.find(query)
                .toArray((err, data) => resolve([err, data]));
        });

        var [err, reminders] = await result;

        if (err)
            continue;

        for (var j = 0; j < reminders.length; j++) {
            var reminder = reminders[j];

            var success = await sender.sendReminder(reminder, date);

            if (success) {
                console.log(`Sent reminder (${reminder.token}) to ${reminder.email}.`);

                await new Promise((resolve, reject) => {
                    db.reminders.updateOne({_id: reminder._id}, {$set: {yearSent: year}},
                        (err, data) => resolve(err, data));
                });
            } else {
                console.log(`Failed to send reminder (${reminder.token}) to ${reminder.email}.`);
            }
        }
    }
}

module.exports = () => {
    db.ready(async () => {
        await main()
            .catch((err) => {
                console.log(err);
            });

        console.log('Mailer has finished.');
    });
};

module.exports();
