const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

const dailyAmount = 500;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Collect your daily reward.'),
    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'This command can only be executed in a server.',
                ephemeral: true,
            });
            return;
        }

        try {
            await interaction.deferReply();

            let userProfile = await UserProfile.findOne({
                userId: interaction.member.id,
            });

            if (userProfile) {
                const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
                const currentDate = new Date().toDateString();

                if (lastDailyDate === currentDate) {
                    const embed = new EmbedBuilder()
                        .setColor("#FFDA70")
                        .setDescription('You have already collected your daily income today. Come back later.');
                    await interaction.editReply({ embeds: [embed] });
                    return;
                }
            } else {
                userProfile = new UserProfile({
                    userId: interaction.member.id,
                });
            }

            userProfile.balance += dailyAmount;
            userProfile.lastDailyCollected = new Date();

            await userProfile.save();

            const embed = new EmbedBuilder()
                .setColor("#62E1B8")
                .setDescription(`$${dailyAmount} was added to your balance.\nNew balance: $${userProfile.balance}`);
            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`An error has occurred. Please try again later.`);
            await interaction.editReply({ embeds: [embed] });
            console.log(`Error handling /daily: ${error}`);
        }
    },
};
