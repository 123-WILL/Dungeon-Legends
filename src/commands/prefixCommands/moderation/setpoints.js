const { MessageActionRow, MessageButton } = require('discord.js');
const carrierModel = require("../../../schemas/carrier");

module.exports = {
    name: 'setpoints',
    description: 'sets the mentioned carriers points',
	async execute(message, client, args) {
        if (!message.member.roles.cache.has(process.env.staff_role_id)) return;
        const carrierID = args[1];
        const setScore = args[2];
        
        if(client.carriers.has(carrierID)) {
            if(isNaN(setScore) === true) {
                await message.reply("Please enter a valid score")
                return;
            }
            
            client.carriers.set(carrierID, { carrierScore: setScore })

            let query = { discordID: carrierID };
            carrierModel.findOneAndUpdate(query, { carrierScore: setScore }).catch((err) => console.log(err));

            const updatedCarrier = client.carriers.get(carrierID);
            const updatedScore = updatedCarrier['carrierScore'];
            const embed = {
                title: `📝 Score Updated:`,
                description: `<@!${carrierID}> now has \`\`${updatedScore}\`\` points!`,
                color: "5865f2",
                footer: {
                    text: "Dungeon Legends",
                    icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                }
            }

            await message.reply({embeds: [embed]})

        } else{
            message.reply("Carrier not found or not a valid userID.")
        }

    }
};