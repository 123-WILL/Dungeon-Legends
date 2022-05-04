module.exports = {
    data: {
        name: 'slayerapp-button'
    },
    async execute (interaction, client) {
        await interaction.update({content: null, color: 5793266, embeds: [{title: "What is your IGN?"}], components: []})

        const collector = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const ignInput = collector.first();
        let ign = ignInput.content;
    
        await interaction.channel.send({embeds: [{title: "Please enter your skycrypt."}]});

        const collector2 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const skycryptInput = collector2.first();
        let skycrypt = skycryptInput.content;

        await interaction.channel.send({embeds: [{title: "What tiers do you want to carry?"}]});

        const collector3 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const tiersInput = collector3.first();
        let tiers = tiersInput.content;

        await interaction.channel.send({embeds: [{title: "How active can you be?"}]});

        const collector4 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const activityInput = collector4.first();
        let activity = activityInput.content;

        await interaction.channel.send({embeds: [{title: "Anything else?"}]});

        const collector5 = await interaction.channel.awaitMessages({ filter: msg => msg.author.id === interaction.user.id, max: 1 }).catch(err => console.log(`No interactions were collected.`));;
        const finalInput = collector5.first();
        let final = finalInput.content;

        const test = `${ign} ${skycrypt}`

        //ign: skycrypt: tiers: activity: last words:
    }
}