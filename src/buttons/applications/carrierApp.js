const mongoose = require('mongoose');
const submitModel = require('../../schemas/application')

module.exports = {
    data: {
        name: 'carrierapp-button'
    },
    async execute (interaction, client) {
        await interaction.update({content: null, color: 5793266, embeds: [{title: "Carrier Application", description: "What is your IGN?"}], components: []})
        
        const collector = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const ign = collector.first();
        
        const collector2 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const skycrypt = collector2.first();

        const trans = client.channels.cache.get('970209829006237697');
        trans.send(`IGN: ${ign}\n\nSkycrypt: ${skycrypt}`)
        //ign: skycrypt: floors: speed proof: activity: last words:
    }
}