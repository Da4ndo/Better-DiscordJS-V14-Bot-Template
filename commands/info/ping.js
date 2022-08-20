const lang = require('../../utils/lang.js');

module.exports = {
	name: 'ping',
	enabled: true,
    aliases: [],
	description: 'Check bot\'s ping.',
	cooldown: 3000,
	permission: { 
		type: null,
	},
	userPerms: [],
	botPerms: [],
	help: {
        usage: '{prefix}{command}',
    },
	run: async (client, message, args) => {
		const server = await client.get.server(message.guild.id);
		message.reply(lang('commands:ping', server.language, [Math.round(client.ws.ping)]));
	}
};
