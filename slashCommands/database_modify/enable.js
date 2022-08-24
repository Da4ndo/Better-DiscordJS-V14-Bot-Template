const { EmbedBuilder, ApplicationCommandType } = require('discord.js');
const lang = require('../../utils/lang.js');

module.exports = {
	name: 'enable',
    enabled: true,
	description: 'Enable a command or slash command',
	cooldown: 0,
	type: ApplicationCommandType.ChatInput,
    permissions: {
        slash_register_data: {
            default_permissions: 'ManageGuild',
            default_member_permissions: 'ManageGuild',
        },
        roles_permissions: {
            user: [],
            bot: [],
        },
        user_permission: {
            type: null,
        }
    },
    help: {
        usage: '/{command} [command] [command-type]',
    },
	options: [
        {
            name: 'command',
            description: 'Set the command.',
            type: 3,
            required: true
        },
        {
            name: 'type',
            description: 'Set the type of the command.',
            type: 3,
            required: true,
            choices: [
                { name: 'Command', value: 'Command' },
                { name: 'SlashCommand', value: 'SlashCommand' },
            ]
        }
    ],
    run: async (client, interaction) => {
        const server = await client.get.server(interaction.guild.id);
        const argcommand = interaction.options.getString('command');
        const argtype = interaction.options.getString('type');

        if (client.config['database.settings'].enabled) {            
            if (!server.commands_data.some(c => c.name === argcommand && c.type.toLowerCase() === argtype.toLowerCase())) {
                const commandNotFound = new EmbedBuilder()
                .setDescription(lang('system:command:not_found', server.language, [argcommand]))
                .setColor('Red');
                return interaction.reply({embeds: [commandNotFound], ephemeral: true});
            }
            var new_commands_data = [];
            
            client.commands.forEach((command) => {
                if (!(server.commands_data.some(c => c.name === command.name)))
                {
                    new_commands_data.push({
                        name: command.name,
                        type: 'command',
                        enabled: (argcommand === command.name && argtype === 'Command') ? true : command.enabled,
                        permission: command.permissions.user_permission,
                    });    
                }
            });

            client.slashCommands.forEach((command) => {
                if (!(server.commands_data.some(c => c.name === command.name)))
                {
                    new_commands_data.push({
                        name: command.name,
                        type: 'slashCommand',
                        enabled: (argcommand === command.name && argtype === 'SlashCommand') ? true : command.enabled,
                        permission: command.permissions.user_permission,
                    });    
                }
            });
            
            server.commands_data.forEach((command) => {
                if (client.commands.has(command.name))
                {
                    new_commands_data.push({
                        name: command.name,
                        type: 'command',
                        enabled: (argcommand === command.name && argtype === 'Command') ? true : command.enabled,
                        permission: command.permission,
                    });    

                } else if (client.slashCommands.has(command.name)) {
                    new_commands_data.push({
                        name: command.name,
                        type: 'slashCommand',
                        enabled: (argcommand === command.name && argtype === 'SlashCommand') ? true : command.enabled,
                        permission: command.permission,
                    });   
                }
            });
            
            server.commands_data = new_commands_data;
            (async () => await client.models.server.findOneAndUpdate({id: server.id}, {commands_data: server.commands_data}))(); 

            const commandEnabled = new EmbedBuilder()
            .setDescription(lang('system:command:enabled', server.language, [argcommand]))
            .setColor('Green');
            interaction.reply({embeds: [commandEnabled]});

        } else {
            const commandNotEnabled = new EmbedBuilder()
            .setDescription(lang('system:database:not_enabled', server.language))
            .setColor('Red');
            interaction.reply({embeds: [commandNotEnabled], ephemeral: true});
        }
    }      
    
};