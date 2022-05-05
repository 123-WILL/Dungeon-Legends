module.exports = {
    data: {
        name: 'appAccept'
    },
    async execute (interaction, client) {
        await interaction.update({ content: '✅ **App Accepted!**', components: []});
        await interaction.channel.send({ content: 'App Accepted! (real)'});
    }
}