const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js')
const ms = require('ms');
const client = require('..');
const cooldown = new Collection();
const lang = require('../utils/lang.js');

client.on('messageCreate', async (message) => {
	if(message.author.bot) return;
	if(message.channel.type === 1) return; // Returns if channel is DM
	const server = await client.get.server(message.guild.id);
	if(!message.content.startsWith(server.prefix)) return; 

	const args = message.content.slice(server.prefix.length).trim().split(/ +/g); 
	const cmd = args.shift();
	
	if(cmd.length == 0 ) return;
	let command = client.commands.get(cmd)
	if(!command) command = client.commands.get(client.aliases.get(cmd)); 

	if (!server.enabled_events.includes('messageCreate')) return; // Returns if event is disabled
	if(command) {
		if (!server.commands_data.some(c => c.name == command.name && c.type == 'command' && c.enabled == true)) {
			// COMMAND NOT ENABLED
			const commandNotEnabled = new EmbedBuilder()
			.setDescription(lang('system:command:not_enabled', server.language, [cmd]))
			.setColor('Red');
			message.reply({ embeds: [commandNotEnabled] })
			return;
		}
		client.logger.debug(`[MessageEvent] Command "${cmd}" used by ${message.author.username} (${message.author.id}).`);

		const user_is_owner = client.config.owners.includes(String(message.author.id));
		const user_role_have_permission = message.member.permissions.has(PermissionsBitField.resolve(command.permissions.roles_permissions.user || []));
		const user_have_permission = ((server.commands_data.filter(c => c.name === command.name && c.type == 'command')[0].permission.type === null) || (server.commands_data.filter(c => c.name === command.name && c.type == 'command')[0].permission.type == 'owners' && client.config.owners.includes(String(message.author.id))) || (server.commands_data.filter(c => c.name === command.name && c.type == 'command')[0].permission.type == 'guildOwner' && message.guild.ownerID === message.author.id) || (server.commands_data.filter(c => c.name === command.name && c.type == 'command')[0].permission.type == 'role' && message.member.roles.cache.some(role => server.commands_data.filter(c => c.name === command.name && c.type == 'command')[0].permission.role === role.id)) || (server.commands_data.filter(c => c.name === command.name && c.type == 'command')[0].permission.type == 'group' && message.member.roles.cache.some(role => (server.groups[server.commands_data.filter(c => c.name === command.name && c.type == 'command')[0].permission.group] || []).includes(String(role.id)))));

		client.logger.info(user_have_permission);

		if(command.cooldown) {
			if(cooldown.has(`${command.name}${message.author.id}`)) return message.channel.send({ content: lang('cooldown', server.language, [ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true})]) });
			if (!user_is_owner && (!user_role_have_permission || !user_have_permission)) {
				const userPerms = new EmbedBuilder()
				.setDescription(lang('system:permisson_denied_user', server.language, [message.author]))
				.setColor('Red');
				return message.reply({ embeds: [userPerms] })
			}
			if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.permissions.roles_permissions.bot || []))) {
				const botPerms = new EmbedBuilder()
				.setDescription(lang('system:permisson_denied_bot', server.language, [message.author, command.permissions.roles_permissions.bot]))
				.setColor('Red');
				return message.reply({ embeds: [botPerms] })
			}

			command.run(client, message, args)
			cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
			setTimeout(() => {
				cooldown.delete(`${command.name}${message.author.id}`)
			}, command.cooldown);

		} else {
			if (!user_is_owner && (!user_role_have_permission || !user_have_permission)) {
				const userPerms = new EmbedBuilder()
				.setDescription(lang('system:permisson_denied_user', server.language, [message.author]))
				.setColor('Red');
				return message.reply({ embeds: [userPerms] })
			}
		
			if (!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.permissions.roles_permissions.bot || []))) {
				const botPerms = new EmbedBuilder()
				.setDescription(lang('system:permisson_denied_bot', server.language, [message.author, command.permissions.roles_permissions.bot]))
				.setColor('Red');
				return message.reply({ embeds: [botPerms] })
			}
			command.run(client, message, args);
		}
	}
	else {
		// COMMAND NOT FOUND
		const commandNotFound = new EmbedBuilder()
		.setDescription(lang('system:command:not_found', server.language, [cmd]))
		.setColor('Red');
		message.reply({ embeds: [commandNotFound] });
	}
});