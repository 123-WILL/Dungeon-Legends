module.exports = {
    data: {
        name: 'close'
    },
    async execute(interaction, client) {
        const ticket = client.tickets.get(interaction.channel.id);
        if (!ticket) return;

        await interaction.reply(`${interaction.user} are you sure you want to delete this ticket? Type yes/y to confirm or no/n to cancel.`);
        const res = (await interaction.channel.awaitMessages({ max: 1 })).first();
        const close = ['yes', 'y'].includes(res.content.toLowerCase());

        if (close) {
            if (ticket['claimerID'] != null) {
                const logChannel = await interaction.guild.channels.fetch(process.env.log_channel_id);
                const logEmbed = {
                    title: `__**@${ticket['buyer']}'s Carry Ticket:**__`,
                    description: `**Type of Carry:** ${ticket['type']} ${ticket['type'] === 'Catacombs' || ticket['type'] === 'Master Mode' ? ticket['floor'] : ticket['tier']}\n**Quantity**: ${ticket['quantity']}\n**Completed by:** <@${ticket['claimerID']}>`,
                    color: 7506394,
                    footer: {
                        text: "Dungeon Legends",
                        icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                };
                await logChannel.send({ embeds: [logEmbed] });
            }

            interaction.channel.messages.fetch().then(async (messages) => {
                const output = (Array.from(messages.values())).reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
                const transcriptEmbed = {
                    title: `__**Transcript for ${ticket['buyer']}'s ${ticket['type']} ${ticket['type'] === 'Catacombs' || ticket['type'] === 'Master Mode' ? 'Floor ' + ticket['floor'] : 'Tier ' + ticket['tier']} Carry:**__`,
                    description: output,
                    color: 7506394,
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
                await interaction.channel.delete().catch(() => { });
            }
        }
    }
}