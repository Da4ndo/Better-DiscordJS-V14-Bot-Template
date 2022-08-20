const mongoose = require('mongoose');

module.exports = {
    connect: async (client) => {   
        mongoose.connect(`${client.config['database.settings'].url}${client.config['database.settings'].database}`, { useNewUrlParser: true, keepAlive: true });
        client.logger.info(`[DB] Connected to database. (${client.config['database.settings'].url}${client.config['database.settings'].database})`);
        console.log(`Connected to database. (${client.config['database.settings'].url}${client.config['database.settings'].database})`);
    },
    get: {
        server: (id) => {
            const client = require('../..');
            client.logger.debug('Called get_server');
            if (client.config['database.settings'].enabled) {
                return new Promise((resolve, reject) => {
                    client.models.server.findOne({id: String(id)}, (err, server) => {
                        if (err) {
                        client.logger.error(err);
                        console.log(err);
                        reject(err);
                    }
                    if (server === null)  {
                        let commands_data = [];
                        
                        client.commands.forEach((value, key) => {
                            commands_data.push({
                                name: value.name,
                                type: 'command',
                                enabled: value.enabled,
                                permission: value.permission,
                            });
                        });
                        client.slashCommands.forEach((value, key) => {
                            commands_data.push({
                                name: value.name,
                                type: 'slashCommand',
                                enabled: value.enabled,
                                permission: value.permission,
                            });
                        });
                        const newServer = new client.models.server({
                            id: String(id),
                            language: client.config['universal.settings'].server.language,
                            prefix: client.config['universal.settings'].server.prefix,
                            commands_data: commands_data,
                            enabled_events: client.config['universal.settings'].server.enabled_events,
                            enabled_managers: client.config['universal.settings'].server.enabled_managers,
                            groups: new Map()
                        });
                        newServer.save();
                        client.logger.debug(`[BD] Added new server to database. (${id})`);
                        
                        resolve({
                            id: String(id),
                            language: client.config['universal.settings'].server.language,
                            prefix: client.config['universal.settings'].server.prefix,
                            commands_data: commands_data,
                            enabled_events: client.config['universal.settings'].server.enabled_events,
                            enabled_managers: client.config['universal.settings'].server.enabled_managers,
                            groups: new Map()
                        });
                    }
                    else { 
                        // UPDATE COMMANDS_DATA
                        function areEqual(array1, array2) {
                            if (array1.length === array2.length) {
                                return array1.every((element, index) => {
                                    if (array2.indexOf(element) !== -1) {
                                        return true;
                                    }
                                    return false;
                                });
                            }
                            return false;
                        }
                        
                        var commands_name = [];
                        server.commands_data.forEach((value) => {commands_name.push(value.name)});
                        if (!areEqual(Array.from(client.commands.keys()).concat(Array.from(client.slashCommands.keys())), commands_name)) {
                            var new_commands_data = [];
                            
                            client.commands.forEach((command) => {
                                if (!(server.commands_data.some(c => c.name === command.name)))
                                {
                                    new_commands_data.push({
                                        name: command.name,
                                        type: 'command',
                                        enabled: command.enabled,
                                        permission: command.permission,
                                    });    
                                }
                            });

                            client.slashCommands.forEach((command) => {
                                if (!(server.commands_data.some(c => c.name === command.name)))
                                {
                                    new_commands_data.push({
                                        name: command.name,
                                        type: 'slashCommand',
                                        enabled: command.enabled,
                                        permission: command.permission,
                                    });    
                                }
                            });
                            
                            server.commands_data.forEach((command) => {
                                if (client.commands.has(command.name))
                                {
                                    new_commands_data.push({
                                        name: command.name,
                                        type: 'command',
                                        enabled: command.enabled,
                                        permission: command.permission,
                                    });    
            
                                } else if (client.slashCommands.has(command.name)) {
                                    new_commands_data.push({
                                        name: command.name,
                                        type: 'slashCommand',
                                        enabled: command.enabled,
                                        permission: command.permission,
                                    });   
                                }
                            });
                            
                            server.commands_data = new_commands_data;
                            (async () => await client.models.server.findOneAndUpdate({id: server.id}, {commands_data: server.commands_data}))(); 
                        }
                        // END
                        resolve(server) 
                    }
                    });
                });
            }
            else { 
                server = client.config['universal.settings'].server; 
                server.id = String(id); 
                let commands_data = [];
                client.commands.forEach((value, key) => {
                    commands_data.push({
                        name: value.name,
                        type: 'command',
                        enabled: value.enabled,
                        permission: value.permission,
                    });
                });
                client.slashCommands.forEach((value, key) => {
                    commands_data.push({
                        name: value.name,
                        type: 'slashCommand',
                        enabled: value.enabled,
                        permission: value.permission,
                    });
                });
                server.commands_data = commands_data;
                return server  
            }
        },
        manager: (name) => {
            const client = require('../..');
            client.logger.debug('Called get_manager');
            if (client.config['database.settings'].enabled) {
                return new Promise((resolve, reject) => {
                    client.models.manager.findOne({name: String(name)}, (err, manager) => {
                        if (err) {
                        client.logger.error(err);
                        console.log(err);
                        reject(err);
                    }
                    if (manager === null)  {
                        const newManager = new client.models.manager({
                            name: name,
                            data: new Map(),
                        });
                        newManager.save();
                        client.logger.debug(`[BD] Added new manager to database. (${name})`);
                        
                        resolve({
                            name: name,
                            data: new Map(),
                        });
                    }
                    else { resolve(manager) }
                    });
                });
            }
            else { 
                manager = client.config['universal.settings'].manager[name]; 
                return manager  
            }
        },
    }
}