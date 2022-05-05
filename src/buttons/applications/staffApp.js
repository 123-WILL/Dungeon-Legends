const appModel = require('../../schemas/application');
const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    data: {
        name: 'staffapp-button'
    },
    async execute (interaction, client) {


        await interaction.update({content: null, color: 5793266, embeds: [{title: "Staff Application", description: "What is your age? *(15+)*"}], components: []})
        const collector = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const age = collector.first();

        await interaction.channel.send({embeds: [{title: "Staff Application", description: "Why do you want to become staff?"}], components: []})
        const collector1 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const reason = collector1.first();

        await interaction.channel.send({embeds: [{title: "Staff Application", description: "Previous Experience? If yes please explain if none say 'none' or 'n/a'"}] })
        const collector2 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const exp = collector2.first();
        
        await interaction.channel.send({embeds: [{title: "Staff Application" ,description: "Tell us a bit about yourself (Hobbies, what you do outside of discord and minecraft, etc)"}] })
        const collector3 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const abtme = collector3.first();
        
        await interaction.channel.send({embeds: [{title: "Staff Application" ,description: "What is your mc IGN?"}] })
        const collector4 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const ign = collector4.first();

        await interaction.channel.send({embeds: [{title: "Staff Application" ,description: "How active can you be?"}] })
        const collector5 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const active = collector5.first();

        await interaction.channel.send({embeds: [{title: "Staff Application" ,description: "**Situation 1:** The server is being raided, and you are the only mod online. What would you do?"}] })
        const collector6 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const sit1 = collector6.first();

        await interaction.channel.send({embeds: [{title: "Staff Application" ,description: "**Situation 2:** You are called out for false-banning someone. What do you do?"}] })
        const collector7 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const sit2 = collector7.first();

        await interaction.channel.send({embeds: [{title: "Staff Application" ,description: "**Situation 3:** There is a group of people sending NSFW and racist things in General. What do you do?"}] })
        const collector8 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const sit3 = collector8.first();
        
        interaction.channel.send({embeds: [{title: "Do you want to submit this application? (yes/no)"}]})

        const yesno = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));
        const xd = yesno.first();

       const bingus = xd.content;

        if(bingus.toLowerCase() === "yes"){
            const trans = client.channels.cache.get('970209829006237697');

            const embed = {
                title: "**Staff Application:**",
                description: `${interaction.user.id}`,
                fields: [
                    {
                        name: "**Discord:**",
                        value: `<@!${interaction.user.id}>`
                    },
                    {
                        name: "**Age:**",
                        value: age.content
                    },
                    {
                        name: '**Reasoning:**',
                        value: reason.content
                    },
                    {
                        name: '**Past expierence:**',
                        value: exp.content
                    },
                    {
                        name: '**About you:**',
                        value: abtme.content
                    },
                    {
                        name: "**IGN:**",
                        value: ign.content
                    },
                    {
                        name: "**Activity:**",
                        value: active.content
                    },
                    {
                        name: "**Situation 1:**",
                        value: sit1.content
                    },
                    {
                        name: "**Situation 2:**",
                        value: sit2.content
                    },
                    {
                        name: "**Situation 3:**",
                        value: sit3.content
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

            trans.send({embeds: [embed], components: [row]})

            await interaction.channel.send({embeds: [{title: "Application Submitted!"}]})
        }
        else{
            interaction.channel.send({embeds:[{title: "Submission Canceled ."}]})
        }
        
        
    }
}