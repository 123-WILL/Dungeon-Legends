module.exports = {
    name: 'purgelist',
    description: 'lists all users below a certain score',
    async execute(message, client, args) {
        if (!message.member.roles.cache.has(process.env.staff_role_id)) return;
        if (!args[1]) return;

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
                if (carrier.carrierScore < args[1]) res.push(`\n  \`\` - \`\` <@!${carrierID}> (${carrier.carrierScore} points)`);
            } else {
                res.push(`\n  \`\` - \`\` <@!${carrierID}> (0 points)`);
            }
        })

        var currentOutput = '';
        for (var i = 0; i < res.length; i++) {
            if ( i % 88 === 0 && i !== 0 || i === res.length - 1) {
                const embed = {
                    title: `**__Carriers To Purge__** (less than ${args[1]} score):`,
                    description: currentOutput,
                    color: 7506394,
                    footer: {
                        text: `Dungeon Legends (${i % 88 > 0 ? Math.trunc(i/88) + 1 : i/88}/${res.length % 88 > 0 ? Math.trunc(res.length/88) + 1 : res.length/88})`,
                        icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                }
                await message.reply({ embeds: [embed] });
                currentOutput = '';
            }
            else { 
                currentOutput += res[i] 
            }
        }
    },
};