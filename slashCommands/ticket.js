const {
  EmbedBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const lang = require("../utils/lang.js");

module.exports = {
  name: "ticket",
  enabled: true,
  description: "Manage ticket.",
  cooldown: 0,
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
    usage: "/{command} [command] (args)",
  },
  options: [
    {
      name: "setup",
      description: "Setup ticket.",
      type: 1,
      options: [
        {
          name: "category",
          description:
            "Specify the category where you want to be ticket channels created.",
          type: 7,
          required: true,
        },
      ],
    },
  ],
  run: async (client, interaction) => {
    const server = await client.get.server(interaction.guild.id);
    const manager = await client.get.manager("ticket");

    if (interaction.options._subcommand === "setup") {
      if (server.enabled_managers.includes(manager.name)) {
        const category = interaction.options.get("category").channel;
        try {
          if (client.config.database) {
            manager.data.set(server.id, { category_id: String(category.id) });
            await client.models.manager.findOneAndUpdate(
              { name: manager.name },
              { data: manager.data }
            );
          } else {
            client.config.default.manager[manager.name].settings.category_id =
              String(category.id);
            fs.writeFile(
              "./config.json",
              JSON.stringify(client.config, null, 4),
              "utf8",
              () => {}
            );
          }

          const ticketembed = new EmbedBuilder()
            .setTitle("Ticket")
            .setDescription(
              lang("commands:ticket:setup", server.language, [
                interaction.guild.name,
              ])
            )
            .setColor("#EEEEEC");
          const ticketbutton = new ButtonBuilder()
            .setCustomId("ticket")
            .setLabel("Ticket")
            .setEmoji("🎫")
            .setStyle(ButtonStyle.Primary);
          await interaction.channel.send({
            embeds: [ticketembed],
            components: [new ActionRowBuilder().addComponents(ticketbutton)],
          });
          await interaction.reply({
            content: lang("commands:setup:succesful", server.language, [
              "ticket",
            ]),
            ephemeral: true,
          });
        } catch (e) {
          client.logger.error(e);
          console.log(`\x1b[31m> Error: ${e}\x1b[0m`);
          await interaction.reply({
            content: lang("commands:setup:error", server.language),
            ephemeral: true,
          });
        }
      }
    }
  },
};
