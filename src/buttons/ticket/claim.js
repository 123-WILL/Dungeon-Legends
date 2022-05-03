const ticketModel = require('../../schemas/ticket');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: {
        name: 'claim'
    },
    async execute(interaction, client) {
        const ticket = client.tickets.get(interaction.channel.id);
        
        if (!ticket) return;
        
        if (interaction.user.id === ticket['buyer']) {
            await interaction.reply({ content: 'You may not claim your own ticket.', ephemeral: true });
            return;
        }
        
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
            )
            
        const carrierRole = await interaction.guild.roles.fetch(ticket['carrierRoleID']);
        if (carrierRole) await interaction.channel.permissionOverwrites.edit(carrierRole, { SEND_MESSAGES: false, VIEW_CHANNEL: false });
        await interaction.channel.permissionOverwrites.edit(interaction.user, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
        
        ticket['claimerID'] = interaction.user.id;
        client.tickets.set(interaction.channel.id, ticket);
        const query = { channelID: interaction.channel.id };
        await ticketModel.findOneAndUpdate(query, { claimerID: ticket['claimerID'] });

        await interaction.channel.send(`📌 Ticket claimed by ${interaction.user}!`)

        await interaction.update({components: [row]});
    }
}