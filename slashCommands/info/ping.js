const { ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'ping',
	enabled: true,
	description: "Check bot's ping.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 0,
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
		await interaction.reply({ content: `🏓 Pong! Latency: **${Math.round(client.ws.ping)} ms**`, ephemeral: true })
	}
};