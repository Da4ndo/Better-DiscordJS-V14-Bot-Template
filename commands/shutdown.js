const { EmbedBuilder } = require('discord.js');
const lang = require('../utils/lang.js');

module.exports = {
	name: 'shutdown',
	enabled: true,
    aliases: [],
	description: 'Shutdown the bot.',
	cooldown: 0,
	permission: {
        type: 'owners'
    },
	userPerms: [],
	botPerms: [],
	help: {
        usage: '{prefix}{command}',
    },
	run: async (client, message, args) => {
		client.logger.debug('Called shutdown.js');
		const server = await client.get.server(message.guild.id);
		const shutdownembed = new EmbedBuilder()
		.setDescription(lang('system:shutdown', server.language))
		.setColor('Blue');
		
		message.reply({embeds: [shutdownembed]}).then(() => {
			client.logger.info('Shutting down...');
			client.logger.end_fstream();
			client.destroy();
			console.log('Logged out.');
			console.log('Exiting process...');
			process.exit();
		});
	}
};
