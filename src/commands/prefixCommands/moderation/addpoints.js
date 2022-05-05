const { MessageActionRow, MessageButton } = require('discord.js');
const carrierModel = require("../../../schemas/carrier");

module.exports = {
    name: 'addpoints',
    description: 'adds the mentioned carriers points',
	async execute(message, client, args) {
        if (!message.member.roles.cache.has(process.env.staff_role_id)) return;
        const carrierID = args[1];
        const addPoints = args[2];
        

        if(client.carriers.has(carrierID)) {

            if(isNaN(addPoints) === true) {
                await message.reply("Please enter a valid score")
                return;
            }
            
            const carrier = client.carriers.get(carrierID);
            const score = carrier['carrierScore'];
            const updatedPoints = parseInt(score) + parseInt(addPoints);

            client.carriers.set(carrierID, { carrierScore: updatedPoints })

            let query = { discordID: carrierID };
            carrierModel.findOneAndUpdate(query, { carrierScore: updatedPoints }).catch((err) => console.log(err));

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

        } else {
            await message.reply("User has either never carried before or invalid userID/Score")
        }

    }
};