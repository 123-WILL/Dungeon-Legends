module.exports = {
    data: {
        name: 'ping-button'
    },
    async execute (interaction, client) {
        await interaction.reply({ content: 'Pinged!', ephemeral: true });
    }
}