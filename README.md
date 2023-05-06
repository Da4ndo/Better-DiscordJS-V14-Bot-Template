<p align="center">
    <img src="https://forthebadge.com/images/badges/powered-by-electricity.svg" />
    <img src="https://forthebadge.com/images/badges/powered-by-black-magic.svg" />
</p>

<p align="center">
	<img src="https://cdn.discordapp.com/attachments/781571299385540649/1026575412601565284/0_E7ioyfbvAEI4v8ta.jpeg?width=960&height=540" height="200" style="float: left; margin: 0px 10px 15px 1px;"/> <a style="font-size: 20px"> <a style="font-size: 30px"><br>
</p>

<p align="center">
    <a style="font-size:15px;font-family:verdana"><b>GitHub Repository Statistics/Info:</b></a><br>
    <img src="https://img.shields.io/github/forks/Da4ndo/Better-DiscordJS-V14-Bot-Template?label=Forks&color=lime&logo=githubactions&logoColor=lime">
    <img src="https://img.shields.io/github/stars/Da4ndo/Better-DiscordJS-V14-Bot-Template?label=Stars&color=yellow&logo=reverbnation&logoColor=yellow">
    <img src="https://img.shields.io/github/license/Da4ndo/Better-DiscordJS-V14-Bot-Template?label=License&color=808080&logo=gitbook&logoColor=808080">
    <img src="https://img.shields.io/github/issues/Da4ndo/Better-DiscordJS-V14-Bot-Template?label=Issues&color=red&logo=ifixit&logoColor=red">
    <br>
    <a style="font-size:15px;font-family:verdana"><b>Language:</b></a><br>
    <img src="https://img.shields.io/badge/JavaScript-100000?label=Made%20with:&style=flat&logo=javascript&color=yellow">
    <br>
    <a style="font-size:15px;font-family:verdana"><b>Fork/Download For:</b></a><br>
    <a href="https://replit.com/github/Da4ndo/Better-DiscordJS-V14-Bot-Template">
        <img src="https://img.shields.io/badge/Repl.it-100000?label=Fork%20on:&style=flat&logo=replit&color=808080&logoColor=white">
    </a>
    <a href="https://github.com/Da4ndo/Better-DiscordJS-V14-Bot-Template/archive/refs/heads/main.zip">
        <img src="https://img.shields.io/badge/Visual Studio Code-100000?label=Download%20for:&style=flat&logo=visual studio code&color=blue&logoColor=007ACC">
    </a>
    <a href="https://github.com/Da4ndo/Better-DiscordJS-V14-Bot-Template/fork">
        <img src="https://img.shields.io/badge/GitHub-100000?label=Fork%20on:&style=flat&logo=github&color=808080">
    </a>
</p>

# Better DiscordJS V14 Bot Template

The Discord bot project made with the npm package of discord.js version 14. It handles prefix commands, slash commands, events, components, multiple languages and logging. You can create as many commands as you want to shape your Bot as you want. **Project made with ❤ by Da4ndo.**

You can click on the star (⭐️) button above this repository if you liked this project! Thank you all. 🙏

Discord.js Documentation is linked [here](https://discord.js.org/#/docs/discord.js/main/general/welcome).

> **Note:** There are a few basic PrefixCommands/SlashCommands/Events/Components added.

> **Important Note:** While the code has been tested, there may still be issues, especially around permission to execute commands. Keep in mind that the included commands, components, and slash commands are examples and should be customized before deployment.

# Changelog

## [1.2.0] - 2023-05-6

### Changed
- Updated handlers to load all valid command files in their directory and all its subdirectories, regardless of how deep the subdirectories go
- Fixed forgetten false reference for configs

### Added
- More basic slash commands (userinfo, serverinfo, avatar)

(More in [**CHANGELOG.md**](https://github.com/Da4ndo/Better-DiscordJS-V14-Bot-Template/blob/main/CHANGELOG.md))

# How to setup:

### 1. Install Required Packages

Run the following command:
```bash
npm install
```
**OR**
```bash
npm install discord.js @discordjs/rest ms dotenv moment mongoose
```

### 2. Modifying configs

Set token and client id in **.env**, and modify settings to your preference in **config.json**

(Checkout documentation file [here](https://github.com/Da4ndo/Better-DiscordJS-V14-Bot-Template/blob/main/DOCS.md).)

## Database

The bot can work in two ways, either with a database or not.

Supported database is **MongoDB**. You can enable the database by setting the database key to true. You need a link/IP address for the bot (e.g.: `mongodb://root:<password>@link.mongodb.net/mydb` or `mongodb://mongo:27017/mydb` or `mongodb://172.19.0.2/`). For local database use **docker-compose.yml**. 

# How to start?

Run the following command:
```bash
npm run start
```
**OR**
```bash
docker-compose up
```

---------------

### Setup bot as a service in linux (***SYSTEMD WAY***):

1. Modify bot.service name to <your_bot_name>.service and fill the missing data in it.

2. Now you need to put it in the system services folder:

```bash
sudo mv <your_bot_name>.service /etc/systemd/system/<your_bot_name>.service
```

3. How to start:

```bash
sudo systemctl start <your_bot_name>
```


You can view it's logs using the following command: 
```bash
journalctl -u <your_bot_name>
```
or use this command to tail the log:
```bash
journalctl -fu <your_bot_name>
```

# How to develop

For more information checkout [**DOCS.md**](https://github.com/Da4ndo/Better-DiscordJS-V14-Bot-Template/blob/main/DOCS.md).
