const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'deleteAll',
	enabled: true,
    aliases: [],
	description: 'Delete all servers and managers data.',
	cooldown: 0,
	permissions: {
        roles_permissions: {
            user: [],
            bot: [],
        },
        user_permission: {
            type: 'owners',
        }
    },
	help: {
        usage: '{prefix}{command}',
    },
	run: async (client, message, args) => {
		client.logger.debug('Called shutdown.js');
		const server = await client.get.server(message.guild.id);
		await client.models.server.deleteMany({});
		await client.models.manager.deleteMany({});
		const deletedembed = new EmbedBuilder()
		.setDescription('✅ Deleted all servers and managers data.')
		.setColor('Green');

        message.reply({embeds: [deletedembed]});
	}
};
