const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'fragbotsetup',
    description: 'sets up channel for people to gain access to fragbot',
    async execute(message, client, args) {
        if (!process.env.owners.split(", ").includes(message.author.id)) return;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('fragticket-open')
                    .setStyle('PRIMARY')
                    .setLabel('🎫 Create Ticket')
            );

        message.channel.send({
            components: [row], embeds: [
                {
                    title: "Fragbot Guide                                                                                  <:Blank:877701652424040459>",
                    description: "Official Fragbot Guide of Dungeon Legends",
                    color: 5793266,
                    thumbnail: {
                        url: "https://images-ext-2.discordapp.net/external/r3_iR595p3PVtW8gs4ZrUFdPhssfI6NRmb5qt-rBYjk/%3Fsize%3D96%26quality%3Dlossless/https/cdn.discordapp.com/emojis/951183284300304425.webp"
                    }
                },
                {
                    title: "Fragbot Information                                                                             <:Blank:877701652424040459>",
                    description: "**Spelling**\nRemember to type your name the exact way it's typed, for example if your name is SuperNaturalMobs, don't type your IGN like this: 'supernaturalmobs', that wont work and if you get whitelisted, the fragbot won't be able to party you.\n\n**Whitelisting**\nAfter your application is accepted, you can find uner #fragbot the name of the fragbot. Your IGN will be whitelisted and you will be able to party the bot. If you leave this discord server your access will be revoked.\n\n**Offline**\nIf the fragbot ever goes offline, please DM <@!429667579687075851>.",
                    color: null
                }
            ]
        });
    },
};