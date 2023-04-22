const mongoose = require("mongoose");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connect(client) {
  process.stdout.write("> Connecting to database... \r");
  const connectionString = `${process.env.MONGO_URL}`;

  mongoose.connect(
    connectionString,
    { useNewUrlParser: true, keepAlive: true },
    function (err) {
      if (err) {
        client.logger.error(err);
        mongoose.connection.readyState = 1;
        sleep(500);
        process.stdout.write(
          "\x1b[31m> Failed to connect to database. \x1b[0m\n"
        );
        process.exit(1);
      }
    }
  );
  var count = 0;
  while (mongoose.connection.readyState !== 1) {
    if (count === 3) {
      count = 0;
    }

    // Don't blame me for this
    var text =
      count == 0
        ? "> Connecting to database.  \r"
        : count == 1
        ? "> Connecting to database.. \r"
        : "> Connecting to database...\r";
    process.stdout.write(text + " \r");
    await sleep(500);

    count++;
  }
  client.logger.info(
    `[DB] Connected to database. (${connectionString})`
  );
  process.stdout.write(
    `\x1b[32m> Connected to database. (${connectionString})\x1b[0m\n`
  );
}

async function getServer(id) {
  const client = require("../../bot");
  client.logger.debug("Called get_server");

  if (!client.config.database) {
    const server = client.config.default.server;
    server.id = String(id);
    let commands_data = [];

    client.commands.forEach((value, key) => {
      commands_data.push({
        name: value.name,
        type: "command",
        enabled: value.enabled,
        permission: value.permissions.user_permission,
      });
    });

    client.slashCommands.forEach((value, key) => {
      commands_data.push({
        name: value.name,
        type: "slashCommand",
        enabled: value.enabled,
        permission: value.permissions.user_permission,
      });
    });

    server.commands_data = commands_data;
    return server;
  }

  try {
    const server = await client.models.server
      .findOne({ id: String(id) })
      .exec();
    if (!server) {
      const commands_data = [];

      client.commands.forEach((value, key) => {
        commands_data.push({
          name: value.name,
          type: "command",
          enabled: value.enabled,
          permission: value.permissions.user_permission,
        });
      });

      client.slashCommands.forEach((value, key) => {
        commands_data.push({
          name: value.name,
          type: "slashCommand",
          enabled: value.enabled,
          permission: value.permissions.user_permission,
        });
      });

      const newServer = new client.models.server({
        id: String(id),
        language: client.config.default.server.language,
        prefix: client.config.default.server.prefix,
        commands_data: commands_data,
        enabled_events:
          client.config.default.server.enabled_events,
        enabled_managers:
          client.config.default.server.enabled_managers,
        groups: new Map(),
      });

      await newServer.save();
      client.logger.debug(`[DB] Added new server to database. (${id})`);

      return {
        id: String(id),
        language: client.config.default.server.language,
        prefix: client.config.default.server.prefix,
        commands_data: commands_data,
        enabled_events:
          client.config.default.server.enabled_events,
        enabled_managers:
          client.config.default.server.enabled_managers,
        groups: new Map(),
      };
    }

    const existingCommands = server.commands_data.map(
      (command) => command.name
    );
    const allCommands = [
      ...client.commands.keys(),
      ...client.slashCommands.keys(),
    ];

    if (!existingCommands.includes(...allCommands)) {
      const newCommands = [];

      client.commands.forEach((command) => {
        if (!existingCommands.includes(command.name)) {
          newCommands.push({
            name: command.name,
            type: "command",
            enabled: command.enabled,
            permission: command.permissions.user_permission,
          });
        }
      });

      client.slashCommands.forEach((command) => {
        if (!existingCommands.includes(command.name)) {
          newCommands.push({
            name: command.name,
            type: "slashCommand",
            enabled: command.enabled,
            permission: command.permissions.user_permission,
          });
        }
      });

      server.commands_data = [...server.commands_data, ...newCommands];
      await client.models.server.findOneAndUpdate(
        { id: server.id },
        { commands_data: server.commands_data }
      );

      client.logger.info(
        `Updated commands list and data for a server (${server.id}).`
      );
    }

    return server;
  } catch (error) {
    client.logger.error(error);
    console.log(`\x1b[31m> Error: ${error}\x1b[0m`);
    throw error;
  }
}

async function getManager(name) {
  const client = require("../../bot");
  client.logger.debug("Called get_manager");

  if (client.config.database) {
    try {
      const manager = await client.models.manager
        .findOne({ name: String(name) })
        .exec();

      if (manager === null) {
        const newManager = new client.models.manager({
          name: name,
          data: new Map(),
        });
        await newManager.save();
        client.logger.debug(`[DB] Added new manager to database. (${name})`);

        return {
          name: name,
          data: new Map(),
        };
      } else {
        return manager;
      }
    } catch (err) {
      client.logger.error(err);
      console.log(`\x1b[31m> Error: ${err}\x1b[0m`);
      throw err;
    }
  } else {
    return client.config.default.manager[name];
  }
}

module.exports = {
  connect,
  get: {
    server: getServer,
    manager: getManager,
  },
};
