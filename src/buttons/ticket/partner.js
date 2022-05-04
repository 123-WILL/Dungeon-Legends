const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: {
        name: 'partner'
    },
    async execute (interaction, client) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`unclaim-${interaction.user.id}`)
                    .setLabel('📌 Unclaim')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId(`close-${interaction.user.id}`)
                    .setLabel('🔒 Close')
                    .setStyle('DANGER')
            );

        await interaction.update({components: [row]});

        await interaction.channel.send({ content: "Please @ your partner!"});
        const collector = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const userID = collector.first();

        let user = userID.mentions.users.first()
        if(!user) return interaction.channel.send("Please mention a user!")

       await interaction.channel.permissionOverwrites.edit(user, { SEND_MESSAGES: true, VIEW_CHANNEL: true });

        await interaction.channel.send(`${user} has been added to the ticket!`)
        
    }
}