module.exports = {
    name: 'leaderboard',
    description: 'lists top 10 carriers',
    async execute(message, client, args) {
        const roles = process.env.floor_role_ids_carriers.split(', ').concat(process.env.tier_role_ids_carriers.split(', ')).concat(process.env.master_role_ids_carriers.split(', ')).concat(process.env.carrier_role_ids.split(', '));
        if (message.member._roles.every(r => !roles.includes(r))) return;

        var res = [];

        const carrierRoleIds = process.env.carrier_role_ids.split(', ');
        const carriers = [];

        try {
            await message.guild.members.fetch();

            carrierRoleIds.forEach(carrierRoleID => {
                const carriersWithRole = message.guild.roles.cache.get(carrierRoleID).members.map(m => m.user.id);
                carriersWithRole.forEach(carrier => {
                    if (!carriers.includes(carrier)) carriers.push(carrier);
                })
            })

        } catch (err) {
            console.error(err);
        }

        carriers.forEach(carrierID => {
            if (client.carriers.has(carrierID)) {
                const carrier = client.carriers.get(carrierID);
                carrierScore = carrier.carrierScore;
                res.push({id: carrierID, score: carrierScore});
            } else {
                res.push({id: carrierID, score: 0});
            }
        })

        res.sort(function compare(a, b) {
            if (a.score < b.score) {
                return 1;
            }
            if (a.score > b.score) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });

        let currentOutput = '';
        for (let i = 0; i < 10 && i < res.length; i++) {
            currentOutput += `\n\`\` ${i + 1} \`\` <@!${res[i].id}> with ${res[i].score} points`
        }

        const embed = {
            title: `**__Carriers Leaderboard__**:`,
            description: currentOutput,
            color: 7506394,
            footer: {
                text: `Top 10 Carriers`,
                icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
            }
        }
        await message.channel.send({ embeds: [embed] });
    },
};