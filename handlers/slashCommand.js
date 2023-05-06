const fs = require("fs").promises;
const path = require("path");
const { PermissionsBitField, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

module.exports = async (client) => {
  client.logger.debug(`Called handlers/slashCommand.js`);

  const slashCommands = [];
  const loadedSlashCommands = [];

  async function loadSlashCommands(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
      if (file.isDirectory()) {
        await loadSlashCommands(path.join(dir, file.name));
      } else if (file.isFile() && file.name.endsWith('.js') && !file.name.startsWith('#')) {
        const slashCommand = require(path.join("../", dir, file.name));
        if (slashCommand.name) {
          const options = slashCommand.options || [];
          const commandData = {
            name: slashCommand.name,
            description: slashCommand.description,
            options,
            default_permission: slashCommand.permissions.slash_register_data.default_permission ?? null,
            default_member_permissions: slashCommand.permissions.slash_register_data.default_member_permissions ? PermissionsBitField.resolve(slashCommand.permissions.slash_register_data.default_member_permissions).toString() : null,
            dm_permission: slashCommand.dm_permission ?? false
          };
          slashCommands.push(commandData);
          client.slashCommands.set(slashCommand.name, slashCommand);
          loadedSlashCommands.push(slashCommand.name);
          client.logger.info(`Loaded slash command: ${slashCommand.name}`);
        }
      }
    }
  }

  await loadSlashCommands("./slashCommands");

  console.log(`Loaded Slash Commands: \n    ${loadedSlashCommands.join('\n    ')}`);
  if (slashCommands.length > 0) {
    (async () => {
      try {
        await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID),
          // Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), // Specific guild
          { body: slashCommands },
        );
        console.log('Slash commands were registered.');
        client.logger.debug('Registered Slash Commands');
      } catch (error) {
        client.logger.error(error);
        console.log(`\x1b[31m> Error: ${error}\x1b[0m`);
      }
    })();
  }
};
