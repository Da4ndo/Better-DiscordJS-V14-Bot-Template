const client = require('..')

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag} (${client.user.id})!\n`);
    client.logger.info(`Logged in as ${client.user.tag} (${client.user.id})!`)
});