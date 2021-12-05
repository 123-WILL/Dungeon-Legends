const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS]});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.tickets = new Collection();
client.buyers = new Collection();
client.buttons = new Collection();

require('dotenv').config();

const functions = fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const slashCommandFolders = fs.readdirSync('./src/commands/slashCommands');
const prefixCommandFolders = fs.readdirSync('./src/commands/prefixCommands');

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    
    client.handleEvents(eventFiles, './src/events');
    client.handleSlashCommands(slashCommandFolders, './src/commands/slashCommands');
    client.handlePrefixCommands(prefixCommandFolders, './src/commands/prefixCommands')
    client.handleButtons();
    client.login(process.env.token);
    client.dbLogin();
})();