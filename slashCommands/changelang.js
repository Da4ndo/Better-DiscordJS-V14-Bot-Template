const { ApplicationCommandType } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'changelang',
    enabled: true,
	description: 'Change the language.',
	cooldown: 0,
	type: ApplicationCommandType.ChatInput,
    default_permissions: 'ManageGuild',
    default_member_permissions: 'ManageGuild',
    permission: {
        type: 'guildOwner'
    },
    dm_permission: false,
    userPerms: [],
	botPerms: [],
    help: {
        usage: '/{command} [language]',
    },
	options: [
        {
            name: 'language',
            description: 'What to language',
            type: 3,
            required: true,
            autocomplete: true,
        }
    ],
    autocomplete: (interaction, choices) => {
        var chs = fs.readdirSync(`./language/`).filter(file => file.endsWith('.json') && !file.startsWith('#'));
        chs.forEach(c => {
            choices.push({
                name: `${c.replace('.json', '')}`,
                value: `${c.replace('.json', '')}`
            });
        });
        interaction.respond(choices).catch(console.error);
    },
    run: async (client, interaction) => {
        if (client.config['database.settings'].enabled) {
            await client.models.server.findOneAndUpdate({id: interaction.guild.id}, {language: interaction.options.get('language').value.replace('.json', '')});
            client.logger.info(`Language changed to ${interaction.options.get('language').value.replace('.json', '')} at server ${interaction.guild.name}`);
        } else {
            client.config['universal.settings'].server.language = interaction.options.get('language').value.replace('.json', '');
            delete client.config['universal.settings'].server.id;
            fs.writeFile('./config.json', JSON.stringify(client.config, null, 4), 'utf8', () => {});
            client.logger.info(`Universal language changed to ${interaction.options.get('language').value.replace('.json', '')}`);
        }
        await interaction.reply({content: `Language changed to **${interaction.options.get('language').value.replace('.json', '')}**.`});
    }
};