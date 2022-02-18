const { MessageActionRow, MessageButton } = require('discord.js');
const carrierModel = require('../../../schemas/carrier');

module.exports = {
    name: 'resign',
    description: 'resigns from all carrier roles',
    async execute(message, client, args) {
        const roles = process.env.floor_role_ids_carriers.split(', ').concat(process.env.tier_role_ids_carriers.split(', ')).concat(process.env.master_role_ids_carriers.split(', ')).concat(process.env.carrier_role_ids.split(', '));
        if (message.member._roles.every(r => !roles.includes(r))) return;
        const time = Date.now();
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`YES_001${message.author.id}${time}`)
                    .setLabel('Yes')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId(`NO_001${message.author.id}${time}`)
                    .setLabel('No')
                    .setStyle('DANGER')
            );

        const msg = await message.channel.send({
            content: 'Are you sure you want to resign?',
            components: [row],
        });

        const res = await msg.channel.awaitMessageComponent({
            componentType: 'BUTTON',
            filter: i => i.user.id === message.author.id && new RegExp(`(?:YES|NO)_001${message.author.id}${time}`).test(i.customId),
        });

        const yes = res.customId === `YES_001${message.author.id}${time}`;

        await res.deferReply({ ephemeral: true });
        if (yes) {
            message.member.roles
                .remove(roles)
                .then(() => {
                    res.editReply({ content: '✔' });
                })
                .catch(() => {
                    res.editReply({ content: 'Failed to remove your roles ❌' });
                });
            await carrierModel.findOneAndDelete({ discordID: message.author.id }).catch((err) => console.log(err));                
        } else {
            res.editReply({ content: '❌' });
        }
    },
};