const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const keepAlive = require('./server.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES]});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.tickets = new Collection();
client.buyers = new Collection();
client.carriers = new Collection();
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
    client.dbLogin();
    client.dbClone();
    client.login(process.env.token);
})();

keepAlive();