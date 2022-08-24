const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'deleteOne',
	enabled: true,
    aliases: [],
	description: 'Delete one server data.',
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
		await client.models.server.deleteOne({id: message.guild.id});
		const deletedembed = new EmbedBuilder()
		.setDescription('✅ Deleted server data.')
		.setColor('Green');

        message.reply({embeds: [deletedembed]});
	}
};
