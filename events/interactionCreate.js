const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('..');
const cooldown = new Collection();
const lang = require('../utils/lang.js');

client.on('interactionCreate', async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const slashCommand = client.slashCommands.get(interaction.commandName);
		if (interaction.channel.type === 1 || interaction.guild === null) return; // Returns if channel is DM
		if (!slashCommand) return client.slashCommands.delete(interaction.commandName);

		const server = await client.get.server(interaction.guild.id);

		if (!server.enabled_events.includes('interactionCreate')) return; // Returns if event is disabled

		const commandData = server.commands_data.find(c => c.name === slashCommand.name && c.type === 'slashCommand');
		if (!commandData || !commandData.enabled) {
			// COMMAND NOT ENABLED
			const commandNotEnabled = new EmbedBuilder()
				.setDescription(lang('system:command:not_enabled', server.language, [interaction.commandName]))
				.setColor('Red');
			await interaction.reply({ embeds: [commandNotEnabled], ephemeral: true });
			return;
		}

		client.logger.debug(`[InteractionEvent] Command "${interaction.commandName}" used by ${interaction.member.user.username} (${interaction.member.user.id}).`);

		try {
			const userIsOwner = client.config.owners.includes(String(interaction.user.id));
			const userRoleHasPermission = interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.permissions.roles_permissions.user || []));
			const userHasPermission = userIsOwner || userRoleHasPermission || (
				commandData.permission.type === null ||
				(commandData.permission.type === 'owners' && client.config.owners.includes(String(interaction.user.id))) ||
				(commandData.permission.type === 'guildOwner' && interaction.guild.ownerID === interaction.user.id) ||
				(commandData.permission.type === 'role' && interaction.member.roles.cache.some(role => commandData.permission.role === role.id)) ||
				(commandData.permission.type === 'group' && interaction.member.roles.cache.some(role => (server.groups[commandData.permission.group] || []).includes(String(role.id))))
			);

			if (slashCommand.cooldown) {
				if (cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: lang('cooldown', server.language, [ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })]) })
				if (!userHasPermission) {
					const userPerms = new EmbedBuilder()
						.setDescription(lang('system:permisson_denied_user', server.language, [interaction.member]))
						.setColor('Red');
					return await interaction.reply({ embeds: [userPerms], ephemeral: true })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.permissions.roles_permissions.bot || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(lang('system:permisson_denied_bot', server.language, [interaction.member, command.permissions.roles_permissions.bot]))
						.setColor('Red');
					return await interaction.reply({ embeds: [botPerms], ephemeral: true })
				}

				await slashCommand.run(client, interaction);
				cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown);
				setTimeout(() => {
					cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
				}, slashCommand.cooldown)

			} else {
				if (!userHasPermission) {
					const userPerms = new EmbedBuilder()
						.setDescription(lang('system:permisson_denied_user', server.language, [interaction.member]))
						.setColor('Red');
					return await interaction.reply({ embeds: [userPerms], ephemeral: true })
				}
				if (!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.permissions.roles_permissions.bot || []))) {
					const botPerms = new EmbedBuilder()
						.setDescription(lang('system:permisson_denied_bot', server.language, [interaction.member, command.permissions.roles_permissions.bot]))
						.setColor('Red');
					return await interaction.reply({ embeds: [botPerms], ephemeral: true })
				}

				await slashCommand.run(client, interaction);
			}
		} catch (e) {
			console.log(e);
			client.logger.error(e);
			console.log(`\x1b[31m> Error: ${e}\x1b[0m`);
		}
	} else if (interaction.isAutocomplete()) {
		const slashCommand = client.slashCommands.get(interaction.commandName);
		if (slashCommand.autocomplete) {
			const choices = [];
			await slashCommand.autocomplete(interaction, choices);
			return;
		}
	} else if (interaction.isButton()) {
		const button = client.buttons.get(interaction.customId);

		if (button) {
			try {
				await button.run(client, interaction);
			} catch (e) {
				client.logger.error(e);
				console.log(`\x1b[31m> Error: ${e}\x1b[0m`);
			}
		}
	} else if (interaction.isSelectMenu()) {
		const selectMenu = client.select_menus.get(interaction.customId);

		if (selectMenu) {
			try {
				await selectMenu.run(client, interaction);
			} catch (e) {
				client.logger.error(e);
				console.log(`\x1b[31m> Error: ${e}\x1b[0m`);
			}
		}
	}
});
