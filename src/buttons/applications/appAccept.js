const submitModel = require('../../schemas/application');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: {
        name: 'appAccept'
    },
    async execute (interaction, client) {
        const user = await submitModel.where("messageID").equals(interaction.message.id);
        const userId = user[0].userID;
        const applicant = interaction.guild.members.cache.find(member => member.id === userId);

        if(user[0].appType === 'carrier') {
            const rowRoles = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`slayerRoles`)
                    .setLabel('Slayer Roles')
                    .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId(`drole-button`)
                    .setLabel('Dungeon Roles')
                    .setStyle('PRIMARY')
            );
            await interaction.update({ content: '✅ **App Accepted!**', components: [rowRoles]});
            await submitModel.findOneAndDelete({ _Id: `carrierApp-${interaction.message.id}` }).catch((err) => console.log(err)); 
        } else { 
            await interaction.update({ content: '✅ **App Accepted!**', components: []});
            const role = interaction.guild.roles.cache.find(r => r.id === process.env.staff_role_id);
            await applicant.roles.add(role); 
            await submitModel.findOneAndDelete({ _Id: `staffApp-${interaction.message.id}` }).catch((err) => console.log(err)); 
        }
    }
}