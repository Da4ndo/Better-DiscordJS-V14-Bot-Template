const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const lang = require("../../utils/lang.js");

module.exports = {
  name: "permission",
  enabled: true,
  description: "Manage permission of a command.",
  cooldown: 2000,
  type: ApplicationCommandType.ChatInput,
  permissions: {
    slash_register_data: {
      default_permissions: "ManageGuild",
      default_member_permissions: "ManageGuild",
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
    usage:
      "/{command} [command] [command-type] [permission] (group_name)/(role)",
  },
  options: [
    {
      name: "command",
      description: "Set the command.",
      type: 3,
      required: true,
    },
    {
      name: "type",
      description: "Set the type of the command.",
      type: 3,
      required: true,
      choices: [
        { name: "Command", value: "Command" },
        { name: "SlashCommand", value: "SlashCommand" },
      ],
    },
    {
      name: "permission",
      description: "Set the permission.",
      type: 3,
      required: true,
      choices: [
        { name: "Bot Owner(s)", value: "owners" },
        { name: "Discord Server Owner", value: "guildOwner" },
        { name: "Group", value: "group" },
        { name: "Role", value: "role" },
        { name: "Nothing", value: "null" },
      ],
    },
    {
      name: "group_name",
      description: "Set the group name for group permission option.",
      type: 3,
    },
    {
      name: "role",
      description: "Set the role for role permission option.",
      type: 8,
    },
  ],
  run: async (client, interaction) => {
    const server = await client.get.server(interaction.guild.id);
    const argcommand = interaction.options.getString("command");
    const argtype = interaction.options.getString("type");
    const argpermission = interaction.options.getString("permission");
    const arggroupname = interaction.options.getString("group_name");
    const argrole = interaction.options.getRole("role");

    if (client.config.database) {
      if (
        !server.commands_data.some(
          (c) =>
            c.name === argcommand &&
            c.type.toLowerCase() === argtype.toLowerCase()
        )
      ) {
        const commandNotFound = new EmbedBuilder()
          .setDescription(
            lang("system:command:not_found", server.language, [argcommand])
          )
          .setColor("Red");
        return interaction.reply({
          embeds: [commandNotFound],
          ephemeral: true,
        });
      }

      if (
        argpermission === "owners" &&
        client.config.owners.includes(String(interaction.user.id))
      ) {
        const userNotOwner = new EmbedBuilder()
          .setDescription(
            lang("commands:permission:not_owner", server.language, [argcommand])
          )
          .setColor("Red");
        return interaction.reply({ embeds: [userNotOwner], ephemeral: true });
      }

      if (
        !server.commands_data.some(
          (c) => c.name === argcommand && c.permission === "owners"
        ) &&
        client.config.owners.includes(String(interaction.user.id))
      ) {
        const userNotOwner = new EmbedBuilder()
          .setDescription(
            lang("commands:permission:command_only_owner", server.language, [
              argcommand,
            ])
          )
          .setColor("Red");
        return interaction.reply({ embeds: [userNotOwner], ephemeral: true });
      }

      var new_commands_data = [];

      client.commands.forEach((command) => {
        if (!server.commands_data.some((c) => c.name === command.name)) {
          new_commands_data.push({
            name: command.name,
            type: "command",
            enabled: command.enabled,
            permission:
              command.name == argcommand
                ? argpermission == "null"
                  ? { type: null }
                  : argpermission == "group"
                  ? { type: "group", group: arggroupname }
                  : argpermission == "role"
                  ? { type: "role", role: String(argrole.id) }
                  : { type: argpermission }
                : command.permissions.user_permission,
          });
        }
      });

      client.slashCommands.forEach((command) => {
        if (!server.commands_data.some((c) => c.name === command.name)) {
          new_commands_data.push({
            name: command.name,
            type: "slashCommand",
            enabled: command.enabled,
            permission:
              command.name == argcommand
                ? argpermission == "null"
                  ? { type: null }
                  : argpermission == "group"
                  ? { type: "group", group: arggroupname }
                  : argpermission == "role"
                  ? { type: "role", role: String(argrole.id) }
                  : { type: argpermission }
                : command.permissions.user_permission,
          });
        }
      });

      server.commands_data.forEach((command) => {
        if (client.commands.has(command.name)) {
          new_commands_data.push({
            name: command.name,
            type: "command",
            enabled: command.enabled,
            permission:
              command.name == argcommand
                ? argpermission == "null"
                  ? { type: null }
                  : argpermission == "group"
                  ? { type: "group", group: arggroupname }
                  : argpermission == "role"
                  ? { type: "role", role: String(argrole.id) }
                  : { type: argpermission }
                : command.permission,
          });
        } else if (client.slashCommands.has(command.name)) {
          new_commands_data.push({
            name: command.name,
            type: "slashCommand",
            enabled: command.enabled,
            permission:
              command.name == argcommand
                ? argpermission == "null"
                  ? { type: null }
                  : argpermission == "group"
                  ? { type: "group", group: arggroupname }
                  : argpermission == "role"
                  ? { type: "role", role: String(argrole.id) }
                  : { type: argpermission }
                : command.permission,
          });
        }
      });

      server.commands_data = new_commands_data;
      (async () =>
        await client.models.server.findOneAndUpdate(
          { id: server.id },
          { commands_data: server.commands_data }
        ))();

      const commandEnabled = new EmbedBuilder()
        .setDescription(
          lang("commands:permission:changed", server.language, [argcommand])
        )
        .setColor("Green");
      interaction.reply({ embeds: [commandEnabled] });
    } else {
      const commandNotEnabled = new EmbedBuilder()
        .setDescription(lang("system:database:not_enabled", server.language))
        .setColor("Red");
      interaction.reply({ embeds: [commandNotEnabled], ephemeral: true });
    }
  },
};
