const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription("Check a user's balance.")
        .addUserOption(option =>
            option.setName('target-user')
                .setDescription('The user whose balance you want to see')),
    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'This command can only be executed in a server.',
                ephemeral: true,
            });
            return;
        }
        
        const targetUserId = interaction.options.getUser('target-user')?.id || interaction.user.id;
        
        await interaction.deferReply();

        try {
            let userProfile = await UserProfile.findOne({ userId: targetUserId });

            if (!userProfile) {
                userProfile = new UserProfile({ userId: targetUserId });
            }

            const embed = new EmbedBuilder()
                .setColor("#62E17F")
                .setDescription(`<@${targetUserId}>'s balance is $${userProfile.balance}.`);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`An error has occurred. Please try again later.`);
            await interaction.editReply({ embeds: [embed] });
            console.log(`Error handling /balance: ${error}`);
        }
    },
};
