module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isCommand()) {

			const command = client.slashCommands.get(interaction.commandName);

			if (!command) return;

			try {
				await command.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		} else if (interaction.isButton) {
			
			let button;

			if (interaction.customId.startsWith('dungeon')) button = client.buttons.get('dungeon-ticket');
			else if (interaction.customId.startsWith('slayer')) button = client.buttons.get('slayer-ticket');
			else if (interaction.customId.startsWith('claim')) button = client.buttons.get('claim');
			else if (interaction.customId.startsWith('close')) button = client.buttons.get('close');
			else if (interaction.customId.startsWith('unclaim')) button = client.buttons.get('unclaim');
			else button = client.buttons.get(interaction.customId);
			
			if (!button) return;
			
			try {
				await button.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
			}
		}
	},
};