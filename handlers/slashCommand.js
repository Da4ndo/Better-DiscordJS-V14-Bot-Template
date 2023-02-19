const fs = require('fs');
const { PermissionsBitField, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest')
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

module.exports = (client) => {
	client.logger.debug(`Called handlers/slashCommand.js`);
	const slashCommands = []; 
	var loaded_slash_commands = [];

	fs.readdirSync('./slashCommands/', { withFileTypes: true }).filter((item) => item.isDirectory()).map((item) => item.name).forEach(dir => {
		fs.readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js') && !file.startsWith('#')).forEach((file) => {
			const slashCommand = require(`../slashCommands/${dir}/${file}`);
			if(slashCommand.name) {
				slashCommands.push({
					name: slashCommand.name,
					description: slashCommand.description,
					type: slashCommand.type,
					options: slashCommand.options ? slashCommand.options : null,
					default_permission: slashCommand.permissions.slash_register_data.default_permission ? slashCommand.permissions.slash_register_data.default_permission : null,
					default_member_permissions: slashCommand.permissions.slash_register_data.default_member_permissions ? PermissionsBitField.resolve(slashCommand.permissions.slash_register_data.default_member_permissions).toString() : null,
					dm_permission: slashCommand.dm_permission ? true : false
				});
		
				client.slashCommands.set(slashCommand.name, slashCommand);
				loaded_slash_commands.push(file.split('.js')[0]);
				client.logger.info(`Loaded slashCommand: ${slashCommand.name}`);
			}
		});
	});

	fs.readdirSync(`./slashCommands/`).filter(file => file.endsWith('.js') && !file.startsWith('#')).forEach((file) => {
		const slashCommand = require(`../slashCommands/${file}`);
		if(slashCommand.name) {
			slashCommands.push({
				name: slashCommand.name,
				description: slashCommand.description,
				type: slashCommand.type,
				options: slashCommand.options ? slashCommand.options : null,
				default_permission: slashCommand.permissions.slash_register_data.default_permission ? slashCommand.permissions.slash_register_data.default_permission : null,
				default_member_permissions: slashCommand.permissions.slash_register_data.default_member_permissions ? PermissionsBitField.resolve(slashCommand.permissions.slash_register_data.default_member_permissions).toString() : null,
				dm_permission: slashCommand.dm_permission ? true : false
			});
		
			client.slashCommands.set(slashCommand.name, slashCommand);
			loaded_slash_commands.push(file.split('.js')[0]);
			client.logger.info(`Loaded slashCommand: ${slashCommand.name}`);
		}
	});

	console.log(`Loaded Slash Commands: \n    ${loaded_slash_commands.join('\n    ')}`);
	if (slashCommands) {
		(async () => {
			try {
				await rest.put(
					Routes.applicationCommands(process.env.CLIENT_ID), 
					{ body: slashCommands },
				);
				console.log(`Slash Commands • Registered`);
				client.logger.debug(`Registered Slash Commands`);
			} catch (error) {
				client.logger.error(error);
				console.log(`\x1b[31m> Error: ${error}\x1b[0m`);
			}
		})();
	}
};
