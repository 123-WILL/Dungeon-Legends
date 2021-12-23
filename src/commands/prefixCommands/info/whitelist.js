const whitelistedModel = require('../../../schemas/whitelisted');
const mongoose = require('mongoose');

module.exports = {
    name: 'whitelist',
    description: 'whitelist a user for the Frag Bot',
    async execute(message, client, args) {
        if (!message.member.roles.cache.has(process.env.staff_role_id)) return;
        const newWhitelisted = new whitelistedModel({
            _id: mongoose.Types.ObjectId(),
            ign: args[1]
        });
        await newWhitelisted.save().catch((err) => console.log(err));

        const embed = {
            title: `✅  ${args[1]} successfully whitelisted!`,
            description: `${args[1]} has been whitelisted to use the Frag Bot.`,
            color: 7506394,
            footer: {
                text: "Dungeon Legends",
                icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
            }
        }
        await message.reply({ embeds: [embed] });
    },
};