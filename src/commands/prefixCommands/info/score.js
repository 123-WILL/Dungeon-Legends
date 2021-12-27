module.exports = {
    name: 'score',
    description: 'find your current carrier score',
    async execute(message, client, args) {
        const roles = process.env.floor_role_ids_carriers.split(', ').concat(process.env.tier_role_ids_carriers.split(', ')).concat(process.env.master_role_ids_carriers.split(', ')).concat(process.env.carrier_role_ids.split(', '));
        if (message.member._roles.every(r => !roles.includes(r))) return;

        var embed;

        if (client.carriers.has(message.author.id)) {
            const carrier = client.carriers.get(message.author.id);
            const score = carrier['carrierScore'];
            embed = {
                title: "📝  Your Current Score:",
                description: `Currently, you have \`\`${score}\`\` points!`,
                color: 7506394,
                footer: {
                    text: "Dungeon Legends",
                    icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                }
            }
        } else {
            embed = {
                title: "📝  Your Current Score:",
                description: 'Currently, you have \`\`0\`\` points!',
                color: 7506394,
                footer: {
                    text: "Dungeon Legends",
                    icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                }
            }
        }
        await message.reply({ embeds: [embed] });
    },
};