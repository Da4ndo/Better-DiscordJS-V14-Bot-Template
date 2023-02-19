require("dotenv").config();
const Logger = require('./utils/logger.js');
const moment = require('moment');

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages, 
		GatewayIntentBits.GuildPresences, 
		GatewayIntentBits.GuildMessageReactions, 
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildEmojisAndStickers,
	], 
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction] 
});
const config = require('./config.json');

client.commands = new Collection()
client.aliases = new Collection()
client.slashCommands = new Collection();
client.buttons = new Collection();
client.select_menus = new Collection();
client.prefix = config['universal.settings'].server.prefix;
client.config = config;
client.models = require('./utils/db/models.js');
client.logger = new Logger(`./log/${moment().format('YYYY-MM-DD')}.log`);

const dbManager = require('./utils/db/manager.js');
client.get = dbManager.get

module.exports = client;

client.logger.init().then(async () => {
	if (config['database.settings'].enabled) await dbManager.connect(client);

	client.logger.info('[MAIN] Called handlers initialization');
	['command', 'slashCommand', 'events', 'component'].forEach((handler) => {
		require(`./handlers/${handler}`)(client)
	});

	client.logger.info('[MAIN] Called login');
	client.login(process.env.TOKEN);
});