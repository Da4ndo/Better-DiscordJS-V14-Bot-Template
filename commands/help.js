const { EmbedBuilder } = require('discord.js');
const lang = require('../utils/lang.js');

module.exports = {
	name: 'help',
    enabled: false,
    aliases: [],
	description: 'Show list of commands.',
	cooldown: 0,
    permission: {
        type: null
    },
	userPerms: [],
	botPerms: [],
    help: {
        usage: '{prefix}{command} [command]',
    },
	run: async (client, message, args) => {
        const server = await client.get.server(message.guild.id);
		var helpembed;
        if (args.length === 0) {
            const fields = [];
            client.commands.forEach((value, key) => {
                fields.push({name: value.name, value: `\`\`\`${value.description}\`\`\``, inline: false});           
            });

            helpembed = new EmbedBuilder()
                .setTitle(lang('commands:help:title', server.language))
                .setDescription(lang('commands:help:description', server.language))
                .setColor('Blue')
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
                .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL()})
                .addFields(fields);           
        }
        else {
            let command = client.commands.get(args[0])
            if(!command) command = client.commands.get(client.aliases.get(args[0]));

            if(command) {
                helpembed = new EmbedBuilder()
                .setTitle(lang('commands:help:title', server.language))
                .setDescription(lang('commands:help:description', server.language))
                .setColor('Blue')
                .setThumbnail(client.user.avatarURL())
                .setTimestamp()
                .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL()})
                .addFields(
                    {name: 'Name', value: `\`\`\`${command.name} \`\`\``, inline: true},
                    {name: 'Aliasas', value: `\`\`\`${command.aliases} \`\`\``, inline: true},
                    {name: 'Cooldown', value: `\`\`\`${command.cooldown} ms\`\`\``, inline: true},
                    {name: 'Usage', value: `\`\`\`${command.help.usage.replace('{prefix}', client.prefix).replace('{command}', command.name)}\`\`\``, inline: true});   
            }
            else {
                // COMMAND NOT FOUND
                const commandNotFound = new EmbedBuilder()
                .setDescription(lang('system:command:not_found', server.language, [args[0]]))
                .setColor('Red')
                message.reply({ embeds: [commandNotFound] })
                return;
            }
        }
        message.reply({embeds: [helpembed]});
        
    }
};