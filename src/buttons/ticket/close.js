const mongoose = require('mongoose');
const ticketModel = require('../../schemas/ticket');
const buyerModel = require('../../schemas/buyer');
const carrierModel = require('../../schemas/carrier')

module.exports = {
    data: {
        name: 'close'
    },
    async execute(interaction, client) {
        const ticket = client.tickets.get(interaction.channel.id);
        if (!ticket) return;
        
        if (interaction.user.id === ticket['buyer']) {
            await interaction.reply({ content: 'You may not close your own ticket.', ephemeral: true });
            return;
        }

        await interaction.reply(`🔒 Ticket closed by ${interaction.user}.`)

        if (ticket['claimerID'] != null) {
            const logChannel = await interaction.guild.channels.fetch(process.env.log_channel_id);

            if(ticket['partnerID'] != null){
                const logEmbed = {
                    title: `__**@${ticket['buyer']}'s Carry Ticket:**__`,
                    description: `**Type of Carry:** ${ticket['type']} ${ticket['type'] === 'Catacombs' || ticket['type'] === 'Master Mode' ? ticket['floor'] : ticket['tier']}\n**Quantity**: ${ticket['quantity']}\n**Completed by:**  <@${ticket['claimerID']}> and <@${ticket['partnerID']}>`,
                    color: "5865f2",
                    footer: {
                        text: "Dungeon Legends",
                        icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                };
                await logChannel.send({ embeds: [logEmbed] });
            }
            else{

                const logEmbed = {
                    title: `__**@${ticket['buyer']}'s Carry Ticket:**__`,
                    description: `**Type of Carry:** ${ticket['type']} ${ticket['type'] === 'Catacombs' || ticket['type'] === 'Master Mode' ? `${ticket['floor']}\n**Score:** ${ticket['score']}`: ticket['tier']}\n**Quantity**: ${ticket['quantity']}\n**Completed by:**  <@${ticket['claimerID']}>`,
                    color: "5865f2",
                    footer: {
                        text: "Dungeon Legends",
                        icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                };
                await logChannel.send({ embeds: [logEmbed] });
            }

            var scoreFromCarry = 0;
            if ( ticket['score'] === 'completion' || ticket['score'] === null ) scoreFromCarry = ticket['quantity'];
            else if ( ticket['score'] === 'S' ) scoreFromCarry = 2 * ticket['quantity'];
            else scoreFromCarry = 3 * ticket['quantity'];

            if (client.carriers.has(ticket['claimerID'])) {
                const carrier = client.carriers.get(ticket['claimerID']);
                client.carriers.set(ticket['claimerID'], { carrierScore: carrier['carrierScore'] + scoreFromCarry })

                const query = { discordID: ticket['claimerID'] };
                await carrierModel.findOneAndUpdate(query, { carrierScore: carrier['carrierScore'] + scoreFromCarry }).catch((err) => console.log(err));

            } else {
                client.carriers.set(ticket['claimerID'], { carrierScore: scoreFromCarry })
                const newCarrier = new carrierModel({
                    _id: mongoose.Types.ObjectId(),
                    discordID: ticket['claimerID'],
                    carrierScore: scoreFromCarry
                });
                await newCarrier.save().catch((err) => console.log(err));
            };
            if(ticket['partnerID'] != null){
                if (client.carriers.has(ticket['partnerID'])) {
                    const carrier = client.carriers.get(ticket['partnerID']);
                    client.carriers.set(ticket['partnerID'], { carrierScore: carrier['carrierScore'] + scoreFromCarry })

                    const query = { discordID: ticket['claimerID'] };
                    await carrierModel.findOneAndUpdate(query, { carrierScore: carrier['carrierScore'] + scoreFromCarry }).catch((err) => console.log(err));

                } else {
                    client.carriers.set(ticket['partnerID'], { carrierScore: scoreFromCarry })
                    const newCarrier = new carrierModel({
                        _id: mongoose.Types.ObjectId(),
                        discordID: ticket['partnerID'],
                        carrierScore: scoreFromCarry
                    });
                    await newCarrier.save().catch((err) => console.log(err));
                }
            }
        }

        interaction.channel.messages.fetch().then(async (messages) => {
            const output = (Array.from(messages.values())).reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
            const transcriptEmbed = {
                title: `__**Transcript for ${ticket['buyer']}'s ${ticket['type']} ${ticket['type'] === 'Catacombs' || ticket['type'] === 'Master Mode' ? 'Floor ' + ticket['floor'] : 'Tier ' + ticket['tier']} Carry:**__`,
                description: output,
                color: "5865f2",
                footer: {
                    text: `Dungeon Legends Carry Transcript`,
                    icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                }
            }

            try {
                const transcriptChannel = await interaction.guild.channels.fetch(process.env.transcripts_channel_id);
                await transcriptChannel.send({ embeds: [transcriptEmbed] });
            } catch (e) {
                console.log(e);
            }
        });

        if (interaction.channel.deletable && !interaction.channel.deleted) {
            client.buyers.delete(ticket['buyer']);
            client.tickets.delete(interaction.channel.id);

            await ticketModel.findOneAndDelete({ channelID: interaction.channel.id });
            await buyerModel.findOneAndDelete({ channelId: interaction.channel.id });

            await interaction.channel.delete().catch(() => { });
        }
            const carrier = client.carriers.get(ticket['claimerID']);
            const score = carrier['carrierScore'];
            const role = process.env.safe_role_id;
            
                if(score >= 10){
                    await interaction.member.roles.add(role);
                }
    }
}