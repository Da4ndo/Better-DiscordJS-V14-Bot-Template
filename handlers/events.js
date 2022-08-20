const fs = require('fs');

module.exports = (client) => {
	client.logger.debug(`Called handlers/events.js`);
	var loaded_events = [];
    fs.readdirSync('./events/').filter((file) => file.endsWith('.js')).forEach((event) => {
      	require(`../events/${event}`);
		loaded_events.push(event.split('.js')[0])
		client.logger.info(`Loaded event: ${event.split('.js')[0]}`);
	})
	console.log(`Loaded Events: \n    ${loaded_events.join('\n    ')}`);
};
