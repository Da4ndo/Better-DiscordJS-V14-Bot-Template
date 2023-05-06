const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const lang = require("../utils/lang.js");

module.exports = {
  name: "help",
  enabled: true,
  description: "Show list of prefix commands.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 0,
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
    usage: "/help [command]",
  },
  options: [
    {
      name: "command",
      description: "Choose a command",
      type: 3,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const server = await client.get.server(interaction.guild.id);
    const argcommand = interaction.options.getString("command");

    if (argcommand) {
      let command = client.commands.get(argcommand);
      if (!command)
        command = client.commands.get(client.aliases.get(argcommand));

      if (command) {
        helpembed = new EmbedBuilder()
          .setTitle(lang("commands:help:title", server.language))
          .setDescription(lang("commands:help:description", server.language))
          .setColor("Blue")
          .setThumbnail(client.user.avatarURL())
          .setTimestamp()
          .setFooter({
            text: interaction.user.tag,
            iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }),
          })
          .addFields(
            {
              name: "Name",
              value: `\`\`\`${command.name} \`\`\``,
              inline: true,
            },
            {
              name: "Aliasas",
              value: `\`\`\`${command.aliases} \`\`\``,
              inline: true,
            },
            {
              name: "Cooldown",
              value: `\`\`\`${command.cooldown} ms\`\`\``,
              inline: true,
            },
            {
              name: "Usage",
              value: `\`\`\`${command.help.usage
                .replace("{prefix}", client.prefix)
                .replace("{command}", command.name)}\`\`\``,
              inline: true,
            }
          );
        await interaction.reply({ embeds: [helpembed] });
      } else {
        // COMMAND NOT FOUND
        const commandNotFound = new EmbedBuilder()
          .setDescription(
            lang("system:command:not_found", server.language, [args[0]])
          )
          .setColor("Red");
        await interaction.reply({ embeds: [commandNotFound], ephemeral: true });
      }
    } else {
      const fields = [];
      client.commands.forEach((value, key) => {
        fields.push({
          name: value.name,
          value: `\`\`\`${value.description}\`\`\``,
          inline: false,
        });
      });

      helpembed = new EmbedBuilder()
        .setTitle(lang("commands:help:title", server.language))
        .setDescription(lang("commands:help:description", server.language))
        .setColor("Blue")
        .setThumbnail(client.user.avatarURL())
        .setTimestamp()
        .setFooter({
          text: interaction.user.tag,
          iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }),
        })
        .addFields(fields);

      await interaction.reply({ embeds: [helpembed] });
    }
  },
};
