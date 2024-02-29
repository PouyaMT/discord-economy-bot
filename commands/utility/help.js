const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows information about the bot.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const embed = new EmbedBuilder()
                .setColor("#FF4661")
                .setTitle('Economy Bot')
                .setDescription(`A simple Discord economy bot that provides the ability for users to gain money by completing tasks, winning games, and more.`)
                .addFields(
                    { name: 'Economy Commands', value: "</daily:1211215706927013901> - Collect your daily reward.\n</work:1211222694419505193> - Work to earn an income.\n</fish:1211279293800390686> - Catch a fish and sell it to get money.\n</beg:1211249063908085811> - Beg people for money.\n</pay:1211288526725980220> - Pay money to another user.\n</balance:1211238431959818240> - Check a user's balance.\n</leaderboard:1211282748778487818> - Check top ten richest users.", inline: false },
					{ name: 'Utility Commands', value: "</help:1211279293800390687> - Shows information about the bot.\n</ping:1211211257487691807> - Shows the bot's ping.", inline: false },
					{ name: 'Source Code', value: 'https://github.com/PouyaMT/discord-economy-bot', inline: false }
				)
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error handling /help:', error);
            const embed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`An error occurred. Please try again later.`);
            await interaction.editReply({ embeds: [embed] });
        }
    },
};
