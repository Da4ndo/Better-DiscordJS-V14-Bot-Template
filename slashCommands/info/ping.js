const { ApplicationCommandType } = require('discord.js');

module.exports = {
	name: 'ping',
	enabled: true,
	description: "Check bot's ping.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	permission: {
        type: null
    },
	dm_permission: false,
	help: {
        usage: '/{command}',
    },
	run: async (client, interaction) => {
		await interaction.reply({ content: `🏓 Pong! Latency: **${Math.round(client.ws.ping)} ms**`, ephemeral: true })
	}
};