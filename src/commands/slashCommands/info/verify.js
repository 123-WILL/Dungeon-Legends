const { Constants } = require('discord.js')
const { hypixel, errors } = require('../../../utils/hypixel');
const { get } = require('axios').default
const iconURL = 'https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif'

module.exports = {
    data: {
        name: 'verify',
        description: 'Link your Minecraft and Discord accounts through Hypixel.',
        options: [
            {
                name: 'ign',
                description: 'Your Minecraft In Game Name (IGN)',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING,
            },
        ],
    },
    async execute(interaction) {
        const { options } = interaction;
        const anyCaseIGN = options.getString('ign');
        var ignAccurate = false;

        await interaction.deferReply({ ephemeral: true })

        hypixel.getPlayer(anyCaseIGN).then(player => {
            const IGN = player.nickname;
            const uuid = player.uuid;
            const socialMedia = player.socialMedia
            if (socialMedia.length != 0) {
                for (var i = 0; i < socialMedia.length; i++) {
                    if (socialMedia[i].id === 'DISCORD') {
                        if (`${interaction.member.user.username}#${interaction.member.user.discriminator}` === socialMedia[i].link) {
                            interaction.editReply({
                                embeds: [{
                                    title: '<a:IconCheckAnimated:875461832431783936>  Verification Succesful! <:Blank:877701652424040459>',
                                    description: `Successfully verified as \`${IGN}\``,
                                    footer: { text: 'Dungeon Legends', iconURL, },
                                },
                                ],
                                ephemeral: true
                            });
                            ignAccurate = true;
                        }
                        else {
                            interaction.editReply({
                                embeds: [{
                                    title: '<a:RedCrossAnimation:877671510251274301> Verification Failed!',
                                    description: `Your Discord account is not linked to that IGN. The linked Discord is currently ${socialMedia[i].link}.`,
                                    footer: { text: 'Dungeon Legends', iconURL, },
                                },
                                ],
                                ephemeral: true
                            });
                        }
                    }
                }
            } else {
                interaction.editReply({
                    embeds: [{
                        title: '<a:RedCrossAnimation:877671510251274301> Verification Failed!',
                        description: `This player does not currently have a linked Discord Account.`,
                        footer: { text: 'Dungeon Legends', iconURL, },
                    },
                    ],
                    ephemeral: true
                });
            }
            if (ignAccurate) {
                interaction.member.roles.add(interaction.guild.roles.cache.find(role => role.name === 'Member')).catch(console.error);
                hypixel.getGuild('player', IGN).then((guild) => {
                    if (guild.id === '60c0a3888ea8c99dccc770ab') interaction.member.roles.add(interaction.guild.roles.cache.find(role => role.name === 'Guild Member')).catch(console.error);
                }).catch(e => console.log(e));

                var isCarrier = false;
                var cataLvl = 0;

                if (interaction.member.roles.cache.some(role => role.name === 'Master Mode Carrier') || interaction.member.roles.cache.some(role => role.name === 'Catacombs Carrier')) {
                    isCarrier = true;
                    get(`https://sky.shiiyu.moe/api/v2/dungeons/${IGN}`).then((skycryptRes) => {
                        if (skycryptRes.status === 200) {
                            const dungeonStats = skycryptRes.data
                            for (const [key, value] of Object.entries(dungeonStats.profiles)) {
                                if (value.dungeons?.catacombs?.level?.level > cataLvl) cataLvl = value.dungeons.catacombs.level.level
                            }
                            try {
                                interaction.member.setNickname(`[${cataLvl}] ${IGN}`);
                            } catch (error) {
                                console.error(error)
                            }
                        }
                    })
                }
                if (!isCarrier) {
                    try {
                        interaction.member.setNickname(`${IGN}`);
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
        }).catch(e => {
            if (!ignAccurate) {
                interaction.editReply({
                    embeds: [{
                        title: '<a:RedCrossAnimation:877671510251274301> Verification Failed!',
                        description: `This player does not exist.`,
                        footer: { text: 'Dungeon Legends', iconURL, },
                    },
                    ],
                    ephemeral: true
                });
            }
        })
    }
}