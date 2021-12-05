module.exports = {
    data: {
        name: 'pong-button'
    },
    async execute (interaction, client) {
        await interaction.reply({ content: 'Ponged!', ephemeral: true });
    }
}