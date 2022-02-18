const carrierModel = require ("../../../schemas/carrier");

module.exports = {
    name: 'autopurge',
    description: 'removes carrier roles from all carriers below a certain score, then resets scores.',
    async execute(message, client, args) {
        if (!process.env.owners.includes(message.author.id)) return;
        if (!args[1]) return;

        const carrierRoleIds = process.env.carrier_role_ids.split(', ');
        const allCarrierRoles = process.env.floor_role_ids_carriers.split(', ').concat(process.env.tier_role_ids_carriers.split(', ')).concat(process.env.master_role_ids_carriers.split(', ')).concat(process.env.carrier_role_ids.split(', '));
        const purged = [];

        try {
            await message.guild.members.fetch();

            carrierRoleIds.forEach(carrierRoleID => {
                const carriersWithRole = message.guild.roles.cache.get(carrierRoleID).members;
                carriersWithRole.forEach(carrier => {
                    if (client.carriers.has(carrier.id)) {
                        let score = client.carriers.get(carrier.id).carrierScore;
                        if (score < args[1]) {
                            carrier.roles.remove(allCarrierRoles);
                            carrierModel.findOneAndDelete({ discordID: carrier.id }).catch((err) => console.log(err));
                            client.carriers.delete(carrier.id);
                            if (!purged.includes(carrier.id)) purged.push(carrier.id);
                        } else {
                            let query = { discordID: carrier.id };
                            carrierModel.findOneAndUpdate(query, { carrierScore: 0 }).catch((err) => console.log(err));
                        }
                    } else {
                        carrier.roles.remove(allCarrierRoles);
                        if (!purged.includes(carrier.id)) purged.push(carrier.id);
                    }
                })
            })

        } catch (err) {
            console.error(err);
        }

        var currentOutput = '';
        for (var i = 0; i < purged.length; i++) {
            currentOutput += `<@${purged[i]}>`;
            if ( i % 88 === 0 && i !== 0 || i === purged.length - 1) {
                const embed = {
                    title: `**__Purged Carriers__** (less than ${args[1]} score):`,
                    description: currentOutput,
                    color: 7506394,
                    footer: {
                        text: `They should've carried more (${i % 88 > 0 ? Math.trunc(i/88) + 1 : i/88}/${purged.length % 88 > 0 ? Math.trunc(purged.length/88) + 1 : purged.length/88})`,
                        icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                }
                await message.reply({ embeds: [embed] });
                currentOutput = '';
            }
        }
    },
};