const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const ticketModel = require('../../schemas/ticket');

const pricing = [300000, 500000, 2000000, 200000];

module.exports = {
    data: {
        name: 'slayer-ticket'
    },
    async execute(interaction, client) {
        const ticket = client.tickets.get(interaction.channel.id);
        if (!ticket) return;
        const questionNumber = ticket.questionNumber;
        if (questionNumber === 0) {
            const row = new MessageActionRow()
                .addComponents(new MessageButton().setCustomId(`slayer-revenant-${interaction.user.id}`).setLabel('Revenant Horror').setStyle('PRIMARY'))
                .addComponents(new MessageButton().setCustomId(`slayer-voidgloom-${interaction.user.id}`).setLabel('Voidgloom Seraph').setStyle('PRIMARY'));

            await interaction.update({ embeds: [{ title: 'Would you like a Revenant Horror or Voidgloom Seraph carry?', author: { iconURL: interaction.user.avatarURL({ dynamic: true }) } }], components: [row] });
            ticket['questionNumber'] = 1;
            client.tickets.set(interaction.channel.id, ticket)
        }
        else if (questionNumber === 1) {
            const pickedType = interaction.customId === `slayer-voidgloom-${interaction.user.id}` ? 'Voidgloom Seraph' : 'Revenant Horror';
            const voidgloom = !!(pickedType === 'Voidgloom Seraph');
            ticket['type'] = pickedType;

            let row;
            if (voidgloom) {
                row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`slayer-${interaction.user.id}tier`)
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions(
                                {
                                    label: '2',
                                    value: '2',
                                },
                                {
                                    label: '3',
                                    value: '3',
                                },
                                {
                                    label: '4',
                                    value: '4',
                                }
                            )
                    );
            } else {
                ticket['tier'] = 5;
                row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`slayer-${interaction.user.id}rev`)
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions(
                                new Array(10).fill(null).map((_, index) => ({
                                    label: (index + 1).toString(),
                                    value: (index + 1).toString(),
                                }))
                            )
                    );
            }
            const title = voidgloom ? 'What tier do you need a carry in?' : 'How many carries do you want?';
            await interaction.update({ embeds: [{ title: title, author: { icon_url: interaction.user.avatarURL({ dynamic: true }) } }], components: [row] });
            ticket['questionNumber'] = 2;
            client.tickets.set(interaction.channel.id, ticket)
        }
        else if (questionNumber === 2) {
            if (interaction.customId === `slayer-${interaction.user.id}tier`) {
                const [option] = interaction.values;
                ticket['tier'] = +option;
                const row = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`slayer-${interaction.user.id}quantity`)
                        .setMinValues(1)
                        .setMaxValues(1)
                        .addOptions(
                            new Array(10).fill(null).map((_, index) => ({
                                label: (index + 1).toString(),
                                value: (index + 1).toString(),
                            }))
                        )
                );

                await interaction.update({ embeds: [{ title: 'How many carries do you want?' }], components: [row] });
                ticket['questionNumber'] = 3;
                client.tickets.set(interaction.channel.id, ticket)
            } else if (interaction.customId === `slayer-${interaction.user.id}rev`) {
                // @ts-ignore
                const [option] = interaction.values;
                ticket['quantity'] = +option;

                ticket['price'] = pricing[ticket['tier'] - 2] * ticket['quantity'];

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

                const embed = {
                    title: "__**Carry Info:**__",
                    description: `**Type:** ${ticket['type']}\n**Tier:** ${ticket['tier'].toString()}\n**IGN:** ${ticket['ign']}\n**Price:** ${displayPrice}\n**Quantity:** ${ticket['quantity'].toString()}`,
                    color: "5865f2",
                    footer: {
                        text: "Dungeon Legends",
                        icon_url: "https://cdn.discordapp.com/attachments/827662473880535042/827913817064734801/standard_14.gif"
                    }
                }
                //
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

                await interaction.update({ embeds: [embed], components: [row] });

                const newChannelName = ticket['type'] === 'Voidgloom Seraph' ? `voidgloom t${ticket['tier'].toString()}-carry` : `rev t${ticket['tier'].toString()}-carry`;
                await interaction.channel.setName(newChannelName);

                const carrierIds = process.env.tier_role_ids_carriers.split(', ');
                ticket['carrierRoleID'] = carrierIds[ticket['tier'] - 2];
                const staffToGet = process.env.staff_role_id;
                const carrierRole = await interaction.guild.roles.fetch(ticket['carrierRoleID']);
                const staffRole = await interaction.guild.roles.fetch(staffToGet);
                if (staffRole) await interaction.channel.permissionOverwrites.edit(staffRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
                if (carrierRole) await interaction.channel.permissionOverwrites.edit(carrierRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });

                await interaction.channel.send(`${carrierRole}, ${interaction.user.username} has requested a carry`);

                client.tickets.set(interaction.channel.id, ticket)
                const query = { channelID: interaction.channel.id };
                await ticketModel.findOneAndUpdate(query, { carrierRoleID: ticket['carrierRoleID'], floor: ticket['floor'], tier: ticket['tier'], type: ticket['type'], price: ticket['price'], quantity: ticket['quantity'], score: ticket['score'], questionNumber: ticket['questionNumber'] })
            }
        }
        else if (questionNumber === 3) {
            const [option] = interaction.values;
            ticket['quantity'] = +option;

            ticket['price'] = pricing[ticket['tier'] - 2] * ticket['quantity'];

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

            const embed = {
                title: "__**Carry Info:**__",
                description: `**Type:** ${ticket['type']}\n**Tier:** ${ticket['tier'].toString()}\n**IGN:** ${ticket['ign']}\n**Price:** ${displayPrice}\n**Quantity:** ${ticket['quantity'].toString()}`,
                color: "5865f2",
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

            await interaction.update({ embeds: [embed], components: [row] });

            const newChannelName = ticket['type'] === 'Voidgloom Seraph' ? `voidgloom t${ticket['tier'].toString()}-carry` : `rev t${ticket['tier'].toString()}-carry`;
            await interaction.channel.setName(newChannelName);

            const carrierIds = process.env.tier_role_ids_carriers.split(', ');
            ticket['carrierRoleID'] = carrierIds[ticket['tier'] - 2];
            const staffToGet = process.env.staff_role_id;
            const carrierRole = await interaction.guild.roles.fetch(ticket['carrierRoleID']);
            const staffRole = await interaction.guild.roles.fetch(staffToGet);
            if (staffRole) await interaction.channel.permissionOverwrites.edit(staffRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
            if (carrierRole) await interaction.channel.permissionOverwrites.edit(carrierRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });

            await interaction.channel.send(`${carrierRole}, ${interaction.user.username} has requested a carry`);

            client.tickets.set(interaction.channel.id, ticket)
            const query = { channelID: interaction.channel.id };
            await ticketModel.findOneAndUpdate(query, {carrierRoleID: ticket['carrierRoleID'], floor: ticket['floor'], tier: ticket['tier'], type: ticket['type'], price: ticket['price'], quantity: ticket['quantity'], score: ticket['score'], questionNumber: ticket['questionNumber']})
        }
    }
}