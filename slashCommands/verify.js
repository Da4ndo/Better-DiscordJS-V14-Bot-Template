const { EmbedBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const lang = require('../utils/lang.js');

module.exports = {
	name: 'verify',
    enabled: true,
	description: 'Manage verify.',
	cooldown: 0,
	type: ApplicationCommandType.ChatInput,
    default_permissions: 'ManageGuild',
    default_member_permissions: 'ManageGuild',
    permission: {
        type: null
    },
    dm_permission: false,
    help: {
        usage: '/{command} [command] (args)',
    },
	options: [
        {
            name: 'setup',
            description: 'Setup verify.',
            type: 1,
            options: [
                {
                    name: 'role',
                    description: 'Specify the verify role to give users.',
                    type: 8,
                    required: true
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        const server = await client.get.server(interaction.guild.id);
        const manager = await client.get.manager('verify');

        if (interaction.options._subcommand === 'setup') {
            if (server.enabled_managers.includes(manager.name)) {
                const role = interaction.options.get('role').role
                try {

                    if (client.config['database.settings'].enabled) {
                        manager.data.set(server.id, {role_id: String(role.id)});
                        await client.models.manager.findOneAndUpdate({name: manager.name}, {data: manager.data});
                    } else {
                        client.config['universal.settings'].manager[manager.name].settings.role_id = String(role.id);
                        fs.writeFile('./config.json', JSON.stringify(client.config, null, 4), 'utf8', () => {});
                    }
                    
                    const verifyembed = new EmbedBuilder()
                    .setTitle('Verify')
                    .setDescription(lang('commands:verify:setup', server.language, [interaction.guild.name]))
                    .setColor('#EEEEEC');   
                    const verifybutton = new ButtonBuilder()
                        .setCustomId('verify')      
                        .setLabel('Verify')
                        .setEmoji('✅')
                        .setStyle(ButtonStyle.Primary);
                    await interaction.channel.send({embeds: [verifyembed], components: [new ActionRowBuilder().addComponents(verifybutton)]});
                    await interaction.reply({content: lang('commands:setup:succesful', server.language, ['verify']), ephemeral: true});
                }
                 catch (e) {
                    client.logger.error(e)
                    console.log(e);
                    await interaction.reply({content: lang('commands:setup:error', server.language), ephemeral: true})
                }
            }  
        }
    }      
    
};