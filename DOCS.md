<p align="center">
    <img src="https://forthebadge.com/images/badges/powered-by-electricity.svg" />
    <img src="https://forthebadge.com/images/badges/powered-by-black-magic.svg" />
</p>

<p align="center">
	<img src="https://media.discordapp.net/attachments/781636061000368209/1010141641836855376/0_E7ioyfbvAEI4v8ta.jpeg?width=960&height=540" height="200" style="float: left; margin: 0px 10px 15px 1px;"/> <a style="font-size: 20px"> <a style="font-size: 30px"><br>
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

# Better DiscordJS V14 Bot Template Documentation

## Configuration

> **Note:** All IDs need to be saved as a string because usual discord IDs are long numbers. MongoDB and json both round up the numbers.

### Owners Setting

You can set the bot's owners in config.json. You need to add the owners' discord profiles' IDs to the owner's list. When you enter the owners, make sure to enclose the IDs in double quotes. `e.g.: {"owners": ["ID1", "ID2"]}`

### Database Settings

Supported database is **MongoDB**. You can enable the database if you set the enable parameter to true. You need a link/IP address for the bot (e.g.: `mongodb://root:<password>@link.mongodb.net/` or `mongodb://192.168.XXX.XXX/`). For local database use **docker-compose.yml**. To get the IP address of the local database you can use Visual Studio Code > Docker Extension. Choose the **container** > **right click** > **select inspect** and the bottom of the file, there is "IpAddress" parameter.

### Server/Universal Settings

The bot can work in two ways. Either use a database or don't. **If the bot uses database**, the logic is when the bot receives a message on a server that is not in the database, it registers it. The basic settings will be the universal.settings section in the config file. After that, you can modify the settings with pre-prepared commands. **If the bot does not use a database**, universal.settings will apply to all servers. The manager section **does not** need to be modified. Regardless of whether you use a database or not, the bot saves the settings automatically.

#### Groups

e.g.: 
```json
"groups": {
    "name1": ["ROLE_ID1", "ROLE_ID2"],
    "name2": ["ROLE_ID1", "ROLE_ID2"]
}
```

## Commands

Under commands and slashCommands directories, you can put the commands **right into the directory** or into **subdirectories**. The bot will automatically load the commands regardless of whether the file is in a subdirectory or not. There are many settings you can specify in the commands files. Some of theme: **name**, **enabled**, **description**, **cooldown**, **permissions**, **help**, ...

**If the bot uses database**, the logic is when the bot registers a new server, it also registers a commands_data section for the server. This includes the name of the command, whether it is enabled and its permissions. The basic settings are the ones you set in the file. **If the bot does not use a database**, the settings will be the settings in the file for each server.

After checking both the user and the bot have permissions to run this command, the bot tries to start the `run` function of the command (file).

---
### Permissions

#### Commands

- Roles permissions (`roles_permissions`) is a section where you can specify that the user and/or bot must have a certain permission. This permission is the permission of roles. (e.g.: Administrator, ManageGuild, ManageChannels, ManageRoles, ...)

- User permissions (`user_permissions`) is a section where you can specify that the user must have a permission, not the same type of permission as the previous one. This permission types: **owners**, **guildOnwer**, **group**, **role**, **null**.

#### SlashCommands

SlashCommands are just a little different. The difference is that there is an extra section called Slash Register Data.
- Slash Register Data (`slash_register_data`) is a section where you can specify default settings for discord slash commands to be registered with.

## Language Managment

The `lang` function can be used to retrieve the text in the language of the given server, you can import the function from utils/lang.js. (`const lang = require('./utils/lang.js');`)
The syntax for the lang function is: **key**, **language** and **replacement**. You can create new language files or modify them within the language folder. 
- **key**: Since there are several keys in a json file, they must be entered as one text separated by colons. (`e.g.: 'commands:help:title'`)

- **language**: For our language, only the file name of the given language must be entered. Usually the easiest way is to pass the server.language argument to the function. (e.g.: `'en'`, `server.language`)

- **replacement**: Replacement is not a mandatory argument that you have to give. This type is a list. The data must be listed in a list. The location of the replacable data in the language files must be marked with `{INDEX}`. (`e.g.: {0}, {1}, {2}`)

## Database

The database files can be found inside `./utils/db/`. The bot connects to the database by calling the `connect` function from manager.js.

### Manager

The **manager.js** returns a connect function and a get section. The get part basically has two parts, `server` and `manager`. The bot makes the get section the same as `client.get`. You may have already figured it out, but with these things we can get certain data. In order to get data belonging to a **server**, the function `client.get.server` must be called with a filter for the server ID (e.g.: `client.get.server({id: 'MYSERVERID'})`, `client.get.server({id: interaction.guild.id})`). In order to get data belonging to a **manager**, the function `client.get.manager` must be called with a filter for the manager's name (`e.g.: client.get.manager({id: 'verify'})`).

### Database Table Schema

Basically, to make a new table in the database, you need to make a new schema. You can do this in the models.js file. All the Schema's will automatically add, to `client.model`. (`e.g.: client.model.server`)

## Components

The components must be placed in the **folders with the name of their type**. Because the bot defines the types based on this and adds it to a Map variable. 