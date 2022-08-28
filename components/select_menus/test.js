const { ChannelType, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const lang = require('../../utils/lang.js');

module.exports = {
	name: 'test',
	run: async (client, interaction) => {
        await interaction.reply({content: `You choosed ${interaction.values}`});
    }
};