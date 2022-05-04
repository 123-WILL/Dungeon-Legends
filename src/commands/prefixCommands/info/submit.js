const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'submit',
    description: 'for carrier applications and such',
	async execute(message, client) {
		try{
		if (!process.env.owners.split(", ").includes(message.member.id)) return;
		
		await message.reply({ 
			content: 'Application sent! Please check your DMs.',
		});

		const embed = {
			title: "Please select below what you want to apply for."
		}

		const row = new MessageActionRow()
		.addComponents(new MessageButton().setCustomId(`carrierapp-button`).setLabel('Carrier').setStyle('PRIMARY').setDisabled(false))
		.addComponents(new MessageButton().setCustomId(`slayerapp-button`).setLabel('Slayer').setStyle('PRIMARY').setDisabled(false))
		.addComponents(new MessageButton().setCustomId(`staffapp-button`).setLabel('Staff').setStyle('PRIMARY').setDisabled(true))

        message.member.send({content: null, embeds:[embed], components: [row]})

	}catch(e){
		console.log(e);
	}


	},
};