const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('..');
const cooldown = new Collection();
const lang = require('../utils/lang.js');

client.on('interactionCreate', async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const slashCommand = client.slashCommands.get(interaction.commandName);
		if(interaction.channel.type === 1 || interaction.guild === null) return; // Returns if channel is DM
		if(!slashCommand) return client.slashCommands.delete(interaction.commandName);

		const server = await client.get.server(interaction.guild.id);

		if (!server.enabled_events.includes('interactionCreate')) return; // Returns if event is disabled

		if (!server.commands_data.some(c => c.name === slashCommand.name && c.enabled === true)) {
			// COMMAND NOT ENABLED
			const commandNotEnabled = new EmbedBuilder()
			.setDescription(lang('system:command:not_enabled', server.language, [interaction.commandName]))
			.setColor('Red');
			await interaction.reply({ embeds: [commandNotEnabled], ephemeral: true});
			return;
		}
		client.logger.debug(`[InteractionEvent] Command "${interaction.commandName}" used by ${interaction.member.user.username} (${interaction.member.user.id}).`);

		try {
			if(slashCommand.cooldown) {
				if(cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return await interaction.reply({ content: lang('cooldown', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), {long : true}) ), ephemeral: true })
				if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || [])) || !((server.commands_data.filter(command => command.name === slashCommand.name)[0].permission && !server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'owners' && client.config.owners.includes(String(interaction.user.id))) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'guildOwner' && interaction.guild.ownerID === interaction.user.id) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'role' && interaction.member.roles.cache.some(role => server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.role === role.id)) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'group' && interaction.member.roles.cache.some(role => (server.groups.has(server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.group) ? server.groups.get(server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.group) : []).includes(role.id))))) {
					const userPerms = new EmbedBuilder()
					.setDescription(lang('system:permisson_denied_user', server.language, [interaction.member]))
					.setColor('Red');
					return await interaction.reply({ embeds: [userPerms], ephemeral: true })
				}
				if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
					.setDescription(lang('system:permisson_denied_bot', server.language, [interaction.member, command.botPerms]))
					.setColor('Red');
					return await interaction.reply({ embeds: [botPerms], ephemeral: true })
				}
				

				await slashCommand.run(client, interaction);
				cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown);
				setTimeout(() => {
						cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
				}, slashCommand.cooldown)
			
			} else {
				/*
				message.member.roles.cache.some(role => (server.groups.has(server.commands_data.filter(c => c.name === command.name)[0].permission.group) ? server.groups.get(server.commands_data.filter(c => c.name === command.name)[0].permission.group) : []).includes(role.id))
				*/
					if (!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || [])) || !((server.commands_data.filter(command => command.name === slashCommand.name)[0].permission && !server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'owners' && client.config.owners.includes(String(interaction.user.id))) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'guildOwner' && interaction.guild.ownerID === interaction.user.id) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'role' && interaction.member.roles.cache.some(role => server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.role === role.id)) || (server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.type == 'group' && interaction.member.roles.cache.some(role => (server.groups.has(server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.group) ? server.groups.get(server.commands_data.filter(command => command.name === slashCommand.name)[0].permission.group) : []).includes(role.id))))) {
						const userPerms = new EmbedBuilder()
						.setDescription(lang('system:permisson_denied_user', server.language, [interaction.member]))
						.setColor('Red');
						return await interaction.reply({ embeds: [userPerms], ephemeral: true })
					}
					if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
						const botPerms = new EmbedBuilder()
						.setDescription(lang('system:permisson_denied_bot', server.language, [interaction.member, command.botPerms]))
						.setColor('Red');
						return await interaction.reply({ embeds: [botPerms], ephemeral: true })
					}

				await slashCommand.run(client, interaction);
			}
		} catch (e) {
			client.logger.error(e);
			console.log(e);
		}
	} else if (interaction.isAutocomplete()) {
		const slashCommand = client.slashCommands.get(interaction.commandName);
		if(slashCommand.autocomplete) {
			const choices = [];
			await slashCommand.autocomplete(interaction, choices)
			return;
		}
	} else if (interaction.isButton) {
		const button = client.buttons.get(interaction.customId);

		if (button)
		{
			try {
				await button.run(client, interaction);
			} catch (e) {
				client.logger.error(e);
				console.log(e);
			}
		}
	}
});