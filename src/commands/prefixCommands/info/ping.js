const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'this is a ping command!',
	async execute(message, client, args) {
		if (!process.env.owners.split(", ").includes(message.author.id)) return;
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
		await message.reply({ content: 'Ping or Pong?', components: [row] });
	},
};