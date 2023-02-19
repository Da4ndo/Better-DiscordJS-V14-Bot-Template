const client = require('..')

client.on("ready", () => {
	console.log(`\x1b[32m> Logged in as ${client.user.tag} (${client.user.id})!\x1b[0m\n`);
    client.logger.info(`Logged in as ${client.user.tag} (${client.user.id})!`)
});