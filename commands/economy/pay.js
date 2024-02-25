const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay money to another user.')
        .addUserOption(option => option
            .setName('target-user')
            .setDescription('The user you want to pay')
            .setRequired(true))
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('The amount of money to pay')
            .setRequired(true)),
    async execute(interaction) {
        let targetUser = interaction.options.getUser('target-user');
        let amount = interaction.options.getNumber('amount');

        await interaction.deferReply();

        try {
            if (amount <= 0) {
                const invalidFundsEmbed = new EmbedBuilder()
                    .setColor("#FF7070")
                    .setDescription(`Invalid amount provided.`);
                return interaction.editReply({ embeds: [invalidFundsEmbed] });
            }

            let payerProfile = await UserProfile.findOne({ userId: interaction.user.id });
            let payeeProfile = await UserProfile.findOne({ userId: targetUser.id });

            if (!payerProfile) {
                payerProfile = new UserProfile({ userId: interaction.user.id })
            }

            if (!payeeProfile) {
                payeeProfile = new UserProfile({ userId: targetUser.id })
            }

            if (payerProfile.balance < amount) {
                const insufficientFundsEmbed = new EmbedBuilder()
                    .setColor("#FF7070")
                    .setDescription(`You have insufficient funds.`);
                return interaction.editReply({ embeds: [insufficientFundsEmbed] });
            }

            payerProfile.balance -= amount;
            payeeProfile.balance += amount;

            await payerProfile.save();
            await payeeProfile.save();

            const successEmbed = new EmbedBuilder()
                .setColor("#62E17F")
                .setDescription(`<@${interaction.user.id}>, you have paid <@${targetUser.id}> $${amount}.`);
            await interaction.editReply({ embeds: [successEmbed] });
        } catch (error) {
            console.error('Error handling /pay:', error);
            const errorEmbed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`An error occurred. Please try again later.`);
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
