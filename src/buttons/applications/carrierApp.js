const mongoose = require('mongoose');
const submitModel = require('../../schemas/application')
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: {
        name: 'carrierapp-button'
    },
    async execute (interaction, client) {
        const userid = interaction.user.id;

        await interaction.update({content: null, color: 5793266, embeds: [{title: "Carrier Application", description: "What is your IGN?"}], components: []})
        const collector = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const ign = collector.first();

        await interaction.channel.send({embeds: [{title: "Staff Application", description: "What is your skycrypt?"}], components: []})
        const collector1 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const skycrypt = collector1.first();

        await interaction.channel.send({embeds: [{title: 'What floors do you want to apply for?'}]});
        const collector2 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const floors = collector2.first();

        await interaction.channel.send({embeds: [{title: "Please submit speed proof for the highest floor you're applying for."}]})
        const collector3 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const speedproof = collector3.first();

        await interaction.channel.send({embeds: [{title: "How active can you be?"}]})
        const collector4 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const activity = collector4.first();


        interaction.channel.send({embeds: [{title: "Do you want to submit this application? (yes/no)"}]})

        const yesno = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const xd = yesno.first();

       const bingus = xd.content;

        if(bingus.toLowerCase() === "yes"){
            const trans = client.channels.cache.get('970240249164886027');

            const embed = {
                title: "**Carrier Application:**",
                description: `carrierApplication-${interaction.user.id}`,
                fields: [
                    {
                        name: "**Discord:**",
                        value: `<@!${interaction.user.id}>`
                    },
                    {
                        name: "**IGN:**",
                        value: ign.content
                    },
                    {
                        name: '**Skycrypt:**',
                        value: skycrypt.content
                    },
                    {
                        name: "**Floors:**",
                        value: floors.content
                    },
                    {
                        name: "**Speed Proof:**",
                        value: speedproof.content
                    },
                    { 
                       name: "**Activity:**",
                       value: activity.content
                    }
                ],
                color: "5865f2"
            }

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`appDeny`)
                    .setLabel('❌ Deny')
                    .setStyle('DANGER')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId(`appAccept`)
                    .setLabel('✅ Accept')
                    .setStyle('SUCCESS')
            );

            let sent = await trans.send({embeds: [embed], components: [row]})
            let messageId = sent.id;
            await submitModel.create({appType: 'carrier', userID: userid, messageID: messageId, _id: `carrierApp-${messageId}`})

            await interaction.channel.send({embeds: [{title: "Application Submitted!"}]})
        }
        else{
            interaction.channel.send({embeds:[{title: "Submission Canceled ."}]})
        }
        //ign: skycrypt: floors: speed proof: activity: last words:
    }
}