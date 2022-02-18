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
                    title: "Carry Ticket                                                                                    <:Blank:877701652424040459>",
                    description: "<:IconVerified3:875461895665098752> List of all the rules for the clients that want to buy a carry.\n\n<:warning2:940631929261277274>Troll Tickets will result in permanent ban.\n\n<:DL_IconPin:877535709475508234> Don't forget to leave a review for the carrier.",
                    color: 5793266,
                    thumbnail: {
                        url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                },
                {
                    title: "Rules & Terms",
                    description: "` 1.` Pricing information can be found in <#938203141088870430>.\n\n` 2.` Answer the ticket questions by clicking the buttons.\n\n` 3.` Don't try to avoid bulk prices in any way.\n\n` 4.` After you got carried, review the carrier in <#936391177014493194>.\n\n` 5.` Tickets are able to have a long waiting time.\n\n` 6.` If you made a mistake in a ticket, don't make another one, instead tell the carrier what you originally wanted.\n\n` 7.` Don't DM any carrier to carry you, you're only able to get carried if you make a ticket.\n\n` 8.` If you are the sole cause of a carry failing, you are not entitled to a refund.",
                    color: null
                }
            ]
        });
    },
};