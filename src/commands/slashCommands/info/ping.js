const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: {
        name: 'ping',
        description: 'Ping, or Pong?',
    },
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('ping-button')
					.setLabel('ping')
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('pong-button')
					.setLabel('pong')
					.setStyle('DANGER'),
			);
		await interaction.reply({ content: 'Ping or Pong?', ephemeral: true, components: [row] });
	},
};