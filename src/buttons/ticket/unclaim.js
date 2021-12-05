const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: {
        name: 'unclaim'
    },
    async execute(interaction, client) {
        const ticket = client.tickets.get(interaction.channel.id);
        
        if (!ticket) return;

        if (interaction.user.id === ticket['buyer']) {
            await interaction.reply({ content: 'You may not unclaim your own ticket.', ephemeral: true });
            return;
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`claim-${interaction.user.id}`)
                    .setLabel('📌 Claim')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId(`close-${interaction.user.id}`)
                    .setLabel('🔒 Close')
                    .setStyle('DANGER')
            )
            
        const carrierRole = await interaction.guild.roles.fetch(ticket['carrierRoleID']);
        if (carrierRole) await interaction.channel.permissionOverwrites.edit(carrierRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
        const pastClaimer = await interaction.guild.members.cache.get(ticket['claimerID']);
        if (pastClaimer) await interaction.channel.permissionOverwrites.delete(pastClaimer);

        ticket['claimerID'] = null;
        client.tickets.set(interaction.channel.id, ticket);

        await interaction.channel.send(`Ticket unclaimed by ${interaction.user}!`)

        await interaction.update({components: [row]});
    }
}