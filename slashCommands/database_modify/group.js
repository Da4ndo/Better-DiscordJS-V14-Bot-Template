const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const lang = require("../../utils/lang.js");

module.exports = {
  name: "group",
  enabled: true,
  description: "Manage role groups.",
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
    usage: "/{command} [command] [name] (args)",
  },
  options: [
    {
      name: "create",
      description: "Command to create a role group.",
      type: 1,
      options: [
        {
          name: "name",
          description: "Set the group name",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "delete",
      description: "Command to delete a role group.",
      type: 1,
      options: [
        {
          name: "name",
          description: "Set the group name",
          type: 3,
          required: true,
        },
      ],
    },
    {
      name: "add",
      description: "Command to create a role group.",
      type: 1,
      options: [
        {
          name: "name",
          description: "Set the group name",
          type: 3,
          required: true,
        },
        {
          name: "role",
          description: "Set the role to add",
          type: 8,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Command to remove a role from a group.",
      type: 1,
      options: [
        {
          name: "name",
          description: "Set the group name",
          type: 3,
          required: true,
        },
        {
          name: "role",
          description: "Set the role to add",
          type: 8,
          required: true,
        },
      ],
    },
    {
      name: "list",
      description: "Command to list roles in a group.",
      type: 1,
      options: [
        {
          name: "name",
          description: "Set the group name",
          type: 3,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const server = await client.get.server(interaction.guild.id);

    if (client.config.database) {
      if (interaction.options._subcommand === "add") {
        const name = interaction.options.get("name").value;
        const role = interaction.options.get("role").role;

        if (!server.groups.hasOwnProperty(name)) {
          interaction.reply({
            content: lang("commands:group:not_existing", server.language, [
              name,
            ]),
          });
          return;
        }

        let new_list = server.groups[name];
        new_list.push(String(role.id));

        server.groups[name] = new_list;
        await client.models.server.findOneAndUpdate(
          { id: server.id },
          { groups: server.groups }
        );

        interaction.reply({
          content: lang("commands:group:added", server.language, [role, name]),
        });
      } else if (interaction.options._subcommand === "remove") {
        const name = interaction.options.get("name").value;
        const role = interaction.options.get("role").role;

        if (!server.groups.hasOwnProperty(name)) {
          interaction.reply({
            content: lang("commands:group:not_existing", server.language, [
              name,
            ]),
          });
          return;
        }

        let new_list = server.groups[name];
        new_list.splice(new_list.indexOf(String(role.id)), 1);

        server.groups[name] = new_list;
        await client.models.server.findOneAndUpdate(
          { id: server.id },
          { groups: server.groups }
        );

        interaction.reply({
          content: lang("commands:group:removed", server.language, [
            role,
            name,
          ]),
        });
      } else if (interaction.options._subcommand === "list") {
        const name = interaction.options.getString("name");

        if (name) {
          if (!server.groups.hasOwnProperty(name)) {
            interaction.reply({
              content: lang("commands:group:not_existing", server.language, [
                name,
              ]),
            });
            return;
          }
          let roles = [];
          server.groups[name].forEach((rId) => {
            let role = interaction.guild.roles.cache.find((r) => r.id === rId);
            if (role) {
              roles.push(`<@&${role.id}>`);
            }
          });
          listembed = new EmbedBuilder()
            .setTitle(
              lang("commands:group:title", server.language, [name + " "])
            )
            .setDescription(`\n${roles.join("\n")}\n`)
            .setColor("#EEEEEC")
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
            .setFooter({
              text: interaction.user.tag,
              iconURL: interaction.user.avatarURL(),
            });
        } else {
          listembed = new EmbedBuilder()
            .setTitle(lang("commands:group:title", server.language, [""]))
            .setDescription(
              `\`\`\`${Array.from(Object.keys(server.groups)).join(
                "\n"
              )}\n\`\`\``
            )
            .setColor("#EEEEEC")
            .setThumbnail(client.user.avatarURL())
            .setTimestamp()
            .setFooter({
              text: interaction.user.tag,
              iconURL: interaction.user.avatarURL(),
            });
        }
        interaction.reply({ embeds: [listembed] });
      } else if (interaction.options._subcommand === "create") {
        const name = interaction.options.get("name").value;

        if (server.groups.hasOwnProperty(name)) {
          interaction.reply({
            content: lang("commands:group:already_existing", server.language, [
              name,
            ]),
          });
          return;
        }

        server.groups[name] = [];
        await client.models.server.findOneAndUpdate(
          { id: server.id },
          { groups: server.groups }
        );

        interaction.reply({
          content: lang("commands:group:created", server.language, [name]),
        });
      } else if (interaction.options._subcommand === "delete") {
        const name = interaction.options.get("name").value;

        if (!server.groups.hasOwnProperty(name)) {
          interaction.reply({
            content: lang("commands:group:not_existing", server.language, [
              name,
            ]),
          });
          return;
        }

        delete server.groups[name];
        await client.models.server.findOneAndUpdate(
          { id: server.id },
          { groups: server.groups }
        );

        interaction.reply({
          content: lang("commands:group:deleted", server.language, [name]),
        });
      }
    } else {
      const commandNotEnabled = new EmbedBuilder()
        .setDescription(lang("system:database:not_enabled", server.language))
        .setColor("Red");
      interaction.reply({ embeds: [commandNotEnabled], ephemeral: true });
    }
  },
};
