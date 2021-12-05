const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: {
        name: 'ticket-open'
    },
    async execute(interaction, client) {
        const { user, guild } = interaction;
        const category = await guild.channels.fetch(process.env.tickets_category);
        if (!category || category.type !== 'GUILD_CATEGORY') {
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        if (client.buyers.has(user.id)) {
            interaction.editReply({content: `<@!${user.id}> Ticket already open.`, ephemeral: true})
                .catch(() => {
                    client.buyers.delete(user.id);
                    client.tickets.delete(client.buyers.get(user.id).channel.id);
                });
            return;
        }

        let channel;

        try {
            const everyone = guild.roles.cache.find(e => e.name === '@everyone');
            channel = await guild.channels.create(`${user.username}-(${user.id})`, {
                parent: category,
                reason: 'User opened ticket',
                permissionOverwrites: [
                    {
                        type: 'role',
                        id: everyone.id,
                        deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'VIEW_CHANNEL', 'ATTACH_FILES'],
                    },
                    {
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                        deny: ['ADD_REACTIONS'],
                        id: user.id,
                        type: 'member',
                    },
                    {
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ADD_REACTIONS', 'MANAGE_CHANNELS'],
                        id: client.user.id,
                        type: 'member',
                    },
                ],
            });
            client.buyers.set(user.id, { channel: channel.id })
        } catch (e) {
            console.log(e);
        }

        if (!channel) return;

        let userIgn = null;

        await channel.send(`${user.toString()} Hello!! What is your IGN?`);

        await interaction.editReply({ content: 'Ticket opened' });

        const collector = await channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 });
        const ign = collector.first();
        ign ? userIgn = ign.content : userIgn = null;

        client.tickets.set(channel.id, { ign: userIgn, carrierRoleID: null, buyer: user.id, claimerID: null, floor: null, tier: null, type: null, price: null, quantity: null, score: null, questionNumber: 0 });

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('dungeon-ticket')
                    .setLabel('Dungeon')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('slayer-ticket')
                    .setLabel('Slayer')
                    .setStyle('PRIMARY')
            );

        channel.send({
            embeds: [{ title: 'Would you like to purchase a dungeon or slayer carry?' }],
            components: [row],
        });
    }
}