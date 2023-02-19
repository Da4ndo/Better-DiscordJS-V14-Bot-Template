const { ChannelType, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const lang = require('../../utils/lang.js');

module.exports = {
	name: 'ticket',
	run: async (client, interaction) => {
        const server = await client.get.server(interaction.guild.id);
        const manager = await client.get.manager('ticket');

		let category = interaction.guild.channels.cache.find(c => c.id === manager.data.get(server.id).category_id);
        interaction.guild.channels.create({
                name: `ticket-${interaction.member.displayName}-${Math.floor(Math.random() * 9999)}`,
                type: ChannelType.GuildText,
                parent: category.id
            }).then(async channel => {
            await channel.lockPermissions();
            await interaction.reply({
                content: lang('commands:ticket:reply1', server.language, [channel]),
                ephemeral: true
            })

            const ticketCreated = new EmbedBuilder()
            .setDescription(lang('commands:ticket:reply2', server.language, [moment().format('YYYY.MM.DD hh:mm:ss')]))
            .setColor('Green');
            await channel.send({embeds: [ticketCreated]});
        });
    }
};