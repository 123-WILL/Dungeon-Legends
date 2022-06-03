const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports = {
    data: {
        name: 'drole-button'
    },
    async execute (interaction, client) {

        const rowRoles = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`f1`)
                    .setLabel('f1')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId(`f2`)
                    .setLabel('f2')
                    .setStyle('PRIMARY')
            );

        await interaction.reply({ embeds: [{title: 'Please select what dungeon roles to give', color: '5865f2'}], components: [rowRoles]});
        const [option] = interaction.values;
        console.log(option);
    }
}