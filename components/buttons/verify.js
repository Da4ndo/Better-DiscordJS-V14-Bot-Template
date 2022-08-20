const lang = require('../../utils/lang.js');

module.exports = {
	name: 'verify',
	run: async (client, interaction) => {
        const server = await client.get.server(interaction.guild.id);
        const manager = await client.get.manager('verify');

		let role = interaction.guild.roles.cache.find(r => r.id === manager.data.get(server.id).role_id);
        interaction.member.roles.add(role);
        await interaction.reply({
            content: lang('commands:verify:reply', server.language),
            ephemeral: true
        })
    }
};
