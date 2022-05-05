const appModel = require('../../schemas/application');

module.exports = {
    data: {
        name: 'appDeny'
    },
    async execute (interaction, client) {
        await interaction.update({ content: '❌ **App Denied!**', components: []});

        await interaction.channel.send({embeds: [{title: "Staff Application" ,description: "Please write a reason why this submission was rejected.", color: 'b40000'}] })
        const collector = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const reason = collector.first();

        interaction.channel.send("Direct message sent! *this doesn't work yet :(* ")
    }
}