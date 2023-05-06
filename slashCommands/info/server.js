const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const lang = require("../../utils/lang.js");

module.exports = {
  name: "serverinfo",
  enabled: true,
  description: "Get information about the server",
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
    usage: "/{command}",
  },
  run: async (client, interaction) => {
    const server = await client.get.server(interaction.guild.id);
    
    const serverInfoEmbed = new EmbedBuilder()
    .setTitle(lang("commands:serverinfo:title", server.language, [interaction.guild.name]))
    .setColor(0x5865F2)
    .setThumbnail(interaction.guild.iconURL())
    .addFields(
      { name: lang("commands:serverinfo:name", server.language), value: interaction.guild.name, inline: true },
      { name: lang("commands:serverinfo:id", server.language), value: interaction.guild.id, inline: true },
      { name: lang("commands:serverinfo:owner", server.language), value: (await interaction.guild.fetchOwner()).user.tag, inline: false },
      { name: lang("commands:serverinfo:created_at", server.language), value: interaction.guild.createdAt.toUTCString(), inline: false },
      { name: lang("commands:serverinfo:channels_count", server.language), value: interaction.guild.channels.cache.size.toString(), inline: false },
      { name: lang("commands:serverinfo:roles_count", server.language), value: interaction.guild.roles.cache.size.toString(), inline: false },
      { name: lang("commands:serverinfo:premium_sub_count", server.language), value: interaction.guild.premiumSubscriptionCount.toString(), inline: false },
      { name: lang("commands:serverinfo:premium_sub_tier", server.language), value: interaction.guild.premiumTier.toString(), inline: false },
      { name: lang("commands:serverinfo:icon_url", server.language), value: interaction.guild.iconURL(), inline: false },
      { name: lang("commands:serverinfo:afk_timeout", server.language), value: interaction.guild.afkTimeout.toString(), inline: false },
    );


    interaction.reply({ embeds: [serverInfoEmbed] });
  },
};
