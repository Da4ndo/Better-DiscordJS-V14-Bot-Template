const { ApplicationCommandType } = require("discord.js");
const lang = require("../../utils/lang.js");

module.exports = {
  name: "avatar",
  enabled: true,
  description: "Get the avatar URL of a user",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
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
  options: [
    {
      name: "user",
      description: "The user to get the avatar of",
      type: 6,
      required: false,
    },
  ],
  help: {
    usage: "/{command} [@user]",
  },
  run: async (client, interaction) => {
    const server = await client.get.server(interaction.guild.id);
    const user = interaction.options.getUser("user") || interaction.user;
    const avatarUrl = user.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 2048,
    });

    interaction.reply({
      content: lang("commands:avatar", server.language, [user.username, avatarUrl]),
    });
  },
};
