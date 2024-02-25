const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription("Check top ten richest users."),
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            const topTen = await UserProfile.find({}).sort({ balance: -1 }).limit(10);

            if (topTen.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#FF7070')
                    .setDescription('No user profiles found.');
                await interaction.editReply({ embeds: [embed] });
                return;
            }

            const formattedBalances = [];
            for (let i = 0; i < 10; i++) {
                const user = topTen[i];
                const rank = i + 1;
                const formattedRank = rank.toString().padStart(2, '0');
                const name = user ? `<@${user.userId}>` : 'N/A';
                const balance = user ? user.balance : '0';
                formattedBalances.push(`\`${formattedRank}\`  ${name} - $${balance}`);
            }

            const embed = new EmbedBuilder()
                .setColor('#62E17F') 
                .setTitle('Leaderboard')
                .setDescription(formattedBalances.join('\n'));
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`An error has occurred. Please try again later.`);
            await interaction.editReply({ embeds: [embed] });
            console.log(`Error handling /leaderboard: ${error}`);
        }
    },
};
