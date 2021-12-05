const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'setup',
    description: 'sets up channel for people to buy a carry',
    async execute(message, client, args) {
        if (!process.env.owners.split(", ").includes(message.author.id)) return;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticket-open')
                    .setStyle('PRIMARY')
                    .setLabel('🎫')
                );
        
        message.channel.send({
            components: [row], embeds: [
                {
                    title: "__**Rules and Terms:**__",
                    description: ":one: Pricing information can be found in #carry-prices.\n\n:two: Answer the ticket questions by clicking the buttons.\n\n:three: Don't try to avoid bulk prices in any way.\n\n:four: After you got carried, review the carrier in carry-reviews.\n\n:five: Please note that most of our carriers have different time zones, so its possible that your ticket have a long waiting time.\n\n:six: If you made a mistake in a ticket, don't make another one, instead tell the carrier what you originally wanted.\n\n:seven: Don't DM any carrier to carry you, you're only able to get carried if you make a ticket.\n\n:eight: If you are the sole cause of a carry failing, you are not entitled to a refund.\n\n:warning: Warning: Troll tickets will result in a permanent ban.",
                    color: 7506394,
                    footer: {
                        "text": "Dungeon Legends",
                        "icon_url": "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                }
            ]
        });
    },
};