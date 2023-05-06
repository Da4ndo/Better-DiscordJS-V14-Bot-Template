const { ApplicationCommandType } = require('discord.js');
const lang = require('../../utils/lang.js');

module.exports = {
	name: 'ping',
	enabled: true,
	description: "Check bot's ping.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	permissions: {
        slash_register_data: {
            default_permissions: null,
            default_member_permissions: null,
        },
        roles_permissions: {
            user: [],
            bot: [],
        },
        user_permission: {
            type: null
        }
    },
	help: {
        usage: '/{command}',
    },
	run: async (client, interaction) => {
        const server = await client.get.server(interaction.guild.id);
		await interaction.reply({ content: lang('commands:ping', server.language, [Math.round(client.ws.ping)]), ephemeral: true })
	}
};