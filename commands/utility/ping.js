const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Shows the bot's ping."),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const reply = await interaction.fetchReply();
            const ping = reply.createdTimestamp - interaction.createdTimestamp;

            const embed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`Pong! Latency: ${ping}ms`);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error handling /ping:', error);
            const embed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`An error occurred. Please try again later.`);
            await interaction.editReply({ embeds: [embed] });
        }
    },
};
