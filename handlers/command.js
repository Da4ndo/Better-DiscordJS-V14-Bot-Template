const fs = require('fs');

module.exports = (client) => {
	client.logger.debug(`Called handlers/command.js`);
	var loaded_commands = [];
	fs.readdirSync('./commands/', { withFileTypes: true }).filter((item) => item.isDirectory()).map((item) => item.name).forEach(dir => {
		fs.readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js') && !file.startsWith('#')).forEach((file) => {
			let command = require(`../commands/${dir}/${file}`)
			if(command) {
				client.commands.set(command.name, command)
				if(command.aliases && Array.isArray(command.aliases)) {
					command.aliases.forEach(alias => {
						client.aliases.set(alias, command.name)
					})
				}
				loaded_commands.push(command.name);
				client.logger.info(`Loaded command: ${command.name}`);
			}
		});
	});

	fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js') && !file.startsWith('#')).forEach((file) => {
		let command = require(`../commands/${file}`)
		if(command) {
			client.commands.set(command.name, command)
			if(command.aliases && Array.isArray(command.aliases)) {
				command.aliases.forEach(alias => {
					client.aliases.set(alias, command.name)
				})
			}
			loaded_commands.push(command.name);
			client.logger.info(`Loaded command: ${command.name}`);
		}
	});
	console.log(`Loaded Commands: \n    ${loaded_commands.join('\n    ')}`);
};
