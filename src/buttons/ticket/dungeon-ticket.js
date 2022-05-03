const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const ticketModel = require('../../schemas/ticket');

const pricing = {
    floors: [
        {
            completion: 25000,
        },
        {
            completion: 50000,
        },
        {
            completion: 75000,
        },
        {
            completion: 400000,
        },
        {
            completion: 350000, S: 650000, 'S+': 850000,
        },
        {
            completion: 700000, S: 1100000, 'S+': 1500000,
        },
        {
            completion: 6000000, S: 10000000, 'S+': 14000000,
        },
    ],

    master_floors: [
        {
            completion: 1000000,
        },
        {
            completion: 2000000,
        },
        {
            completion: 3500000,
        },
        {
            completion: 10000000,
        },
        {
            completion: 5000000,
        },
        {
            completion: 7000000,
        },
    ],
};

module.exports = {
    data: {
        name: 'dungeon-ticket'
    },
    async execute(interaction, client) {
        const ticket = client.tickets.get(interaction.channel.id);
        if (!ticket) return;
        const questionNumber = ticket.questionNumber;

        const pinnedEmbed = {
            title: "Dungeon Legends                                                 <:Blank:877701652424040459>",
            description: "Carry Ticket of Dungeon Legends",
            color: 5793266,
            thumbnail: {"url":"https://cdn.discordapp.com/emojis/943623937277980702.webp?size=96&quality=lossless"}
        } //will dont touch pls jos wanted this idk why

        if (questionNumber === 0) {
            const row = new MessageActionRow()
                .addComponents(new MessageButton().setCustomId(`dungeon-${interaction.user.id}catacombs`).setLabel('Catacombs').setStyle('PRIMARY'))
                .addComponents(new MessageButton().setCustomId(`dungeon-${interaction.user.id}master-mode`).setLabel('Master Mode').setStyle('PRIMARY'));

            await interaction.update({ embeds: [pinnedEmbed,{ title: 'Would you like a carry for Catacombs or Master Mode?   <:Blank:877701652424040459>', author: { iconURL: interaction.user.avatarURL({ dynamic: true }) } }], components: [row] });
            ticket['questionNumber'] = 1;
            client.tickets.set(interaction.channel.id, ticket)
        }
        else if (questionNumber === 1) {
            const pickedType = interaction.customId === 'dungeon-' + interaction.user.id + 'catacombs' ? 'Catacombs' : 'Master Mode';
            const len = pickedType === 'Catacombs' ? 7 : 6;

            ticket['type'] = pickedType;

            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`dungeon-${interaction.user.id}v1_q2_slection`)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(
                        new Array(len).fill(null).map((_, index) => ({
                            label: (index + 1).toString(),
                            value: (index + 1).toString(),
                        }))
                    )
            );

            await interaction.update({ embeds: [pinnedEmbed,{ title: `Which floor do you need a carry in?                                           <:Blank:877701652424040459>`, author: { icon_url: interaction.user.avatarURL({ dynamic: true }) } }], components: [row] });
            ticket['questionNumber'] = !!(ticket['type'] === 'Master Mode') ? 3 : 2;
            client.tickets.set(interaction.channel.id, ticket)
        }
        else if (questionNumber === 2) {
            const [option] = interaction.values;
            ticket['floor'] = +option;

            const row = new MessageActionRow();

            const master = !!(ticket['type'] === 'Master Mode');
            const floorPrices = pricing[master ? 'master_floors' : 'floors'][ticket['floor'] - 1];
            for (const key of Object.keys(floorPrices)) {
                row.addComponents(new MessageButton().setCustomId(`dungeon-${interaction.user.id}v1_${key}`).setLabel(key).setStyle('PRIMARY'));
            }

            await interaction.update({ embeds: [pinnedEmbed,{ title: 'What score do you want?                                                              <:Blank:877701652424040459>', author: { icon_url: interaction.user.avatarURL({ dynamic: true }) } }], components: [row] });
            ticket['questionNumber'] = 3;
            client.tickets.set(interaction.channel.id, ticket)
        }
        else if (questionNumber === 3) {
            const master = !!(ticket['type'] === 'Master Mode');

            if (!master) {
                const pickedScore = interaction.customId.slice(interaction.user.id.length + 11);
                ticket['score'] = pickedScore;    
            } else {
                const [option] = interaction.values;
                ticket['floor'] = +option;
                ticket['score'] = 'completion'; 
            }
            
            const row = new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`dungeon-${interaction.user.id}-quantity`)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(
                        new Array(10).fill(null).map((_, index) => ({
                            label: (index + 1).toString(),
                            value: (index + 1).toString(),
                        }))
                    )
            );

            await interaction.update({ embeds: [pinnedEmbed,{ title: 'How many carries do you want?                                                 <:Blank:877701652424040459>', author: { icon_url: interaction.user.avatarURL({ dynamic: true }) } }], components: [row] });
            ticket['questionNumber'] = 4;
            client.tickets.set(interaction.channel.id, ticket)
        }
        else if (questionNumber === 4) {
            const [option] = interaction.values;

            ticket['quantity'] = +option;
            client.tickets.set(interaction.channel.id, ticket)

            const master = !!(ticket['type'] === 'Master Mode');
            const floor = pricing[master ? 'master_floors' : 'floors'][ticket['floor'] - 1];
            ticket['price'] = (floor[ticket['score']]) * ticket['quantity'];

            var si = [
                { value: 1, symbol: "" },
                { value: 1E3, symbol: "K" },
                { value: 1E6, symbol: "M" },
                { value: 1E9, symbol: "B" },
            ];
            var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var i;
            // for negative value is work
            for (i = si.length - 1; i > 0; i--) {
                if (ticket['price'] >= si[i].value) {
                    break;
                }
            }
            const displayPrice = (ticket['price'] / si[i].value).toFixed(2).replace(rx, "$1") + si[i].symbol;

            const summaryEmbed =
            {
                title: "Carry Information                                                                             <:Blank:877701652424040459>",
                description: `**IGN:** ${ticket['ign']}\n\n**Type:** ${ticket['type']}\n\n**Floor:** ${ticket['floor']}\n\n**Score:** ${ticket['score']}\n\n**Quantity:** ${ticket['quantity'].toString()}\n\n**Price:** ${displayPrice}`,
                color: null,
                footer: {
                    text: "Dungeon Legends",
                    icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                }
            }

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`claim-${interaction.user.id}`)
                        .setLabel('📌 Claim')
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId(`close-${interaction.user.id}`)
                        .setLabel('🔒 Close')
                        .setStyle('DANGER')
                );

                

            const newChannelName = master ? `m${ticket['floor'].toString()}-carry` : `f${ticket['floor'].toString()}-carry`;
            await interaction.channel.setName(newChannelName);

            const carrierIds = master ? process.env.master_role_ids_carriers.split(', ') : process.env.floor_role_ids_carriers.split(', ');
            ticket['carrierRoleID'] = carrierIds[ticket['floor'] - 1];
            const staffToGet = process.env.staff_role_id;
            const carrierRole = await interaction.guild.roles.fetch(ticket['carrierRoleID']);
            const staffRole = await interaction.guild.roles.fetch(staffToGet);
            if (staffRole) await interaction.channel.permissionOverwrites.edit(staffRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
            if (carrierRole) await interaction.channel.permissionOverwrites.edit(carrierRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });

            await interaction.update({content: `<:BDL_DiscordVerified:949046396823171133> ${carrierRole}, ${interaction.user.username} has requested a carry`,embeds: [pinnedEmbed,summaryEmbed], components: [row] });

            const query = { channelID: interaction.channel.id };
            await ticketModel.findOneAndUpdate(query, { carrierRoleID: ticket['carrierRoleID'], floor: ticket['floor'], tier: ticket['tier'], type: ticket['type'], price: ticket['price'], quantity: ticket['quantity'], score: ticket['score'], questionNumber: ticket['questionNumber'] });
        }
    }
}