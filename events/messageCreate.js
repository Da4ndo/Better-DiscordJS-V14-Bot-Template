const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('..');
const cooldowns = new Collection();
const lang = require('../utils/lang.js');

client.on('messageCreate', async (message) => {
  if (message.author.bot || message.channel.type === 1) return;

  const server = await client.get.server(message.guild.id);
  if (!message.content.startsWith(server.prefix)) return;

  const args = message.content.slice(server.prefix.length).trim().split(/ +/g);
  const cmd = args.shift();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!server.enabled_events.includes('messageCreate') || !command) {
    const commandStatus = command ? 'not_enabled' : 'not_found';
    const commandEmbed = new EmbedBuilder()
      .setDescription(lang(`system:command:${commandStatus}`, server.language, [cmd]))
      .setColor('Red');
    return message.reply({ embeds: [commandEmbed] });
  }

  client.logger.debug(`[MessageEvent] Command "${cmd}" used by ${message.author.username} (${message.author.id}).`);

  const userIsOwner = client.config.owners.includes(String(message.author.id));
  const userRoleHasPermission = message.member.permissions.has(PermissionsBitField.resolve(command.permissions.roles_permissions.user || []));
  const commandData = server.commands_data.find(c => c.name === command.name && c.type === 'command');
  const userHasPermission = userIsOwner || userRoleHasPermission || (
		commandData.permission.type === null ||
		(commandData.permission.type === 'owners' && client.config.owners.includes(String(message.author.id))) ||
		(commandData.permission.type === 'guildOwner' && message.guild.ownerID === message.author.id) ||
		(commandData.permission.type === 'role' && message.member.roles.cache.some(role => commandData.permission.role === role.id)) ||
		(commandData.permission.type === 'group' && message.member.roles.cache.some(role => (server.groups[commandData.permission.group] || []).includes(String(role.id))))
	);
	
  const cooldownKey = `${command.name}${message.author.id}`;
  const userOnCooldown = cooldowns.has(cooldownKey);

  if (!userHasPermission || userOnCooldown) {
    const embedType = userOnCooldown ? 'cooldown' : 'system:permisson_denied_user';
    const embedData = userOnCooldown ? [ms(cooldowns.get(cooldownKey) - Date.now(), { long: true })] : [message.author];
    const responseEmbed = new EmbedBuilder()
      .setDescription(lang(embedType, server.language, embedData))
      .setColor('Red');
    return message.reply({ embeds: [responseEmbed] });
  }

  const botHasPermission = message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.permissions.roles_permissions.bot || []));
  if (!botHasPermission) {
    const botPerms = new EmbedBuilder()
      .setDescription(lang('system:permisson_denied_bot', server.language, [message.author, command.permissions.roles_permissions.bot]))
      .setColor('Red');
    return message.reply({ embeds: [botPerms] });
  }

  command.run(client, message, args);

  if (command.cooldown) {
    cooldowns.set(cooldownKey, Date.now() + command.cooldown);
    setTimeout(() => {
      cooldowns.delete(cooldownKey);
    }, command.cooldown);
  }
});
