const { MessageActionRow, MessageButton } = require('discord.js');
const mongoose = require('mongoose');
const ticketModel = require('../../schemas/ticket');
const buyerModel = require('../../schemas/buyer');

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
            const openUser = client.buyers.get(user.id);
            if (interaction.guild.channels.cache.get(openUser['channel']) === undefined) {
                client.buyers.delete(user.id);
                client.tickets.delete(openUser['channel']);

                await ticketModel.findOneAndDelete({ buyer: user.id });
                await buyerModel.findOneAndDelete({ buyerID: user.id });
            } else {
                interaction.editReply({ content: `<@!${user.id}> Ticket already open.`, ephemeral: true });
                return;
            }
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
            const newBuyer = new buyerModel({
                _id: mongoose.Types.ObjectId(),
                buyerID: user.id,
                channelId: channel.id
            });
            await newBuyer.save().catch((err) => console.log(err));
        } catch (e) {
            console.log(e);
        }

        if (!channel) return;

        let userIgn = null;

        await channel.send({content: `${user.toString()}`, embeds: [{title: "What is your IGN?                                                                            <:Blank:877701652424040459>"}]});

        await interaction.editReply({ content: 'Ticket opened' });

        const collector = await channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const ign = collector.first();
        if (ign) { 
            userIgn = ign.content;
        } else { 
            return ;
        }

        client.tickets.set(channel.id, { ign: userIgn, carrierRoleID: null, buyer: user.id, claimerID: null, floor: null, tier: null, type: null, price: null, quantity: null, score: null, questionNumber: 0 });
        const newTicket = new ticketModel({ _id: mongoose.Types.ObjectId(), channelID: channel.id, ign: userIgn, buyer: user.id, questionNumber: 0 });
        await newTicket.save().catch((err) => console.log(err));

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
            
            const pinnedEmbed = {
                title: "Dungeon Legends                                                 <:Blank:877701652424040459>",
                description: "Carry Ticket of Dungeon Legends",
                color: 5793266,
                thumbnail: {"url":"https://cdn.discordapp.com/emojis/943623937277980702.webp?size=96&quality=lossless"}
            } // will dont touch this jos wanted this here uwu

        channel.send({
            embeds: [pinnedEmbed,{ title: 'Would you like to purchase a Dungeon or Slayer carry?    <:Blank:877701652424040459>' }],
            components: [row],
        });
    }
}