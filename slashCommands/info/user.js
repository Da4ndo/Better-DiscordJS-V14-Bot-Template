const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const lang = require("../../utils/lang.js");

module.exports = {
  name: "userinfo",
  enabled: true,
  description: "Get information about a user.",
  cooldown: 0,
  type: ApplicationCommandType.ChatInput,
  permissions: {
    slash_register_data: {
      default_permissions: null,
      default_member_permissions: null,
    },
    roles_permissions: {
      user: [],
      bot: [],
    },
    user_permission: {
      type: null,
    },
  },
  help: {
    usage: "/{command} <user>",
  },
  options: [
    {
      name: "user",
      description: "The user to get information for.",
      type: 6,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const server = await client.get.server(interaction.guild.id);
    const member = interaction.options.getMember("user");

    const embed = new EmbedBuilder()
    .setTitle(lang(`commands:userinfo:title`, server.language, [member.user.tag]))
    .setColor("#5865F2")
    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() || 'https://cdn.discordapp.com/embed/avatars/0.png'})
    .setThumbnail(member.user.avatarURL())
    .addFields(
      { name: lang(`commands:userinfo:name`, server.language), value: member.user.tag.toString(), inline: true },
      { name: lang(`commands:userinfo:id`, server.language), value: member.id.toString(), inline: true },
      { name: lang(`commands:userinfo:joined_at`, server.language), value: member.joinedAt.toString(), inline: false },
      { name: lang(`commands:userinfo:activity`, server.language), value: member.presence.activities[0] ? member.presence.activities[0].name.toString() : "N/A", inline: false },
      { name: lang(`commands:userinfo:desktop_status`, server.language), value: member.presence.clientStatus.desktop ? member.presence.clientStatus.desktop.toString() : "N/A", inline: false },
      { name: lang(`commands:userinfo:top_role`, server.language), value: member.roles.highest.toString(), inline: false },
      { name: lang(`commands:userinfo:roles_count`, server.language), value: member.roles.cache.size.toString(), inline: false }
    );

    await interaction.reply({ embeds: [embed] });

  },
};
