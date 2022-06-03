const submitModel = require('../../schemas/application');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: {
        name: 'appDeny'
    },
    async execute (interaction, client) {
        await interaction.update({ content: '❌ **App Denied!**', components: []});
        await interaction.channel.send({embeds: [{title: "Application" ,description: "Please write a reason why this submission was rejected and a dm will be sent.", color: 'b40000'}] })

        const collector = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const reason = collector.first();
        const user = await submitModel.where("messageID").equals(interaction.message.id);
        const userId = user[0].userID;
        const applicant = interaction.guild.members.cache.find(member => member.id === userId);
        

        if(user[0].appType === 'staff') {
            await applicant.send({embeds: [{title: `❌ Your staff appliction has been denied because | **'${reason}'**.`}]});

            await submitModel.findOneAndDelete({ _Id: `staffApp-${interaction.message.id}` }).catch((err) => console.log(err)); 
        } else {
            await applicant.send({embeds: [{title:`❌ Your carrier appliction has been denied because **'${reason}'**.`}]});
            
            await submitModel.findOneAndDelete({ _Id: `carrierApp-${interaction.message.id}` }).catch((err) => console.log(err));
        }

        await interaction.channel.send({embeds: [{title: "Direct message sent!"}]})
    }
}