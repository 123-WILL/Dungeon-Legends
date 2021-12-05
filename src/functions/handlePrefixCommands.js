const fs = require('fs');

module.exports = (client) => {
    client.handlePrefixCommands = async (commandFolders, path) => {
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/prefixCommands/${folder}/${file}`);
                // Set a new item in the Collection
                // With the key as the command name and the value as the exported module
                client.prefixCommands.set(command.name, command);
            }
        }
    }
}