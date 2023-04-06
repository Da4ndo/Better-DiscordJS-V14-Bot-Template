const fs = require("fs").promises;

module.exports = async (client) => {
  client.logger.debug(`Called handlers/command.js`);

  const commandDirs = await fs.readdir("./commands/", { withFileTypes: true });
  const loadedCommands = [];

  for (const dir of commandDirs) {
    if (dir.isDirectory()) {
      const files = await fs.readdir(`./commands/${dir.name}/`);

      for (const file of files) {
        if (file.endsWith(".js") && !file.startsWith("#")) {
          try {
            const command = require(`../commands/${dir.name}/${file}`);
            if (command) {
              client.commands.set(command.name, command);
              if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach((alias) => {
                  client.aliases.set(alias, command.name);
                });
              }
              loadedCommands.push(command.name);
              client.logger.info(`Loaded command: ${command.name}`);
            }
          } catch (err) {
            client.logger.error(`Error loading command: ${file}\n${err.stack}`);
          }
        }
      }
    }
  }

  const files = await fs.readdir("./commands/");
  for (const file of files) {
    if (file.endsWith(".js") && !file.startsWith("#")) {
      try {
        const command = require(`../commands/${file}`);
        if (command) {
          client.commands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach((alias) => {
              client.aliases.set(alias, command.name);
            });
          }
          loadedCommands.push(command.name);
          client.logger.info(`Loaded command: ${command.name}`);
        }
      } catch (err) {
        client.logger.error(`Error loading command: ${file}\n${err.stack}`);
      }
    }
  }

  console.log(`Loaded Commands: \n    ${loadedCommands.join("\n    ")}`);
};
