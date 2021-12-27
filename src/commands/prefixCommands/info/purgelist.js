module.exports = {
    name: 'purgelist',
    description: 'lists all users below a certain score',
    async execute(message, client, args) {
        if (!message.member.roles.cache.has(process.env.staff_role_id)) return;
        if (!args[1]) return;

        var res = '';

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
                if (carrier.carrierScore < args[1]) res += `\n  \`\` - \`\` <@!${carrierID}> (${carrier.carrierScore} points)`
            } else {
                res += `\n  \`\` - \`\` <@!${carrierID}> (0 points)`;
            }
        })

        const embed = {
            title: `**__Carriers To Purge__** (less than ${args[1]} score):`,
            description: res,
            color: 7506394,
            footer: {
                text: "Dungeon Legends",
                icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
            }
        }
        await message.reply({ embeds: [embed] });
    },
};