const prefix = process.env.prefix;

module.exports = {
    name: "messageCreate",
	async execute(message, client) {
		if (!message.content.startsWith(prefix) || message.author.bot) return;
        
        const commandName = message.content.slice(prefix.length).split(/ +/).shift().toLowerCase();
        const args = message.content.slice(prefix.length).trim().split(/ +/g);;
        const command = client.prefixCommands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, client, args);
        } catch (error) {
            console.error(error);
            await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        } 
	},
};