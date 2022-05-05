const carrierModel = require("../../../schemas/carrier");

module.exports = {
    name: 'resetscores',
    description: 'resets scores.',
    async execute(message, client, args) {
        if (!message.member.roles.cache.has(process.env.staff_role_id)) return;

        const carrierRoleIds = process.env.carrier_role_ids.split(', ');
        try {
            await message.guild.members.fetch();

            carrierRoleIds.forEach(carrierRoleID => {
                const carriersWithRole = message.guild.roles.cache.get(carrierRoleID).members;
                carriersWithRole.forEach(carrier => {
                    client.carriers.set(carrier.id, { carrierScore: 0 })
                    let query = { discordID: carrier.id };
                    carrierModel.findOneAndUpdate(query, { carrierScore: 0 }).catch((err) => console.log(err));
                })
            })


        } catch (err) {
            console.error(err);
        }


        const embed = {
            title: `**Success.**`,
            description: "All scores have been reset.",
            color: 7506394,
            footer: {
                text: `Dungeon Legends`,
                icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
            }
        }
        await message.reply({ embeds: [embed] });
    },
};