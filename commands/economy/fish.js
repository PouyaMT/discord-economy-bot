const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Cooldown = require('../../schemas/Cooldown');
const UserProfile = require('../../schemas/UserProfile');

function getRandomNumber(x, y) {
    const range = y - x + 1;
    const randomNumber = Math.floor(Math.random() * range);
    return randomNumber + x;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('Catch a fish and sell it to get money.'),
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

            const commandName = 'fish';
            const userId = interaction.user.id;

            let cooldown = await Cooldown.findOne({
                userId, commandName
            });

            if (cooldown && Date.now() < cooldown.endsAt) {
                const { default: prettyMs } = await import('pretty-ms');

                const embed = new EmbedBuilder()
                    .setColor("#FFDA70")
                    .setDescription(`You are on cooldown. Come back after ${prettyMs(cooldown.endsAt - Date.now())}.`);
                await interaction.editReply({ embeds: [embed] });
                return;
            }

            if (!cooldown) {
                cooldown = new Cooldown({ userId, commandName });
            }

            const chance = getRandomNumber(0, 100);

            if (chance < 40) {
                const embed = new EmbedBuilder()
                    .setColor("#70D2FF")
                    .setDescription('You did not catch any fish this time. Come back later.');
                await interaction.editReply({ embeds: [embed] });

                cooldown.endsAt = Date.now() + 400_000;
                await cooldown.save();
                return;
            }

            const amount = getRandomNumber(50, 175);

            let fishes = ['mackerel', 'salmon', 'shellfish', 'tuna'];
            let fish = Math.floor((Math.random() * fishes.length));

            let userProfile = await UserProfile.findOne({ userId });

            if (!userProfile) {
                userProfile = new UserProfile({ userId });
            }

            userProfile.balance += amount;
            cooldown.endsAt = Date.now() + 400_000;

            await Promise.all([cooldown.save(), userProfile.save()]);

            const embed = new EmbedBuilder()
                .setColor("#70D2FF")
                .setDescription(`You caught a ${fishes[fish]} and sold it for $${amount}.\nNew balance: $${userProfile.balance}`);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor("#FF7070")
                .setDescription(`An error has occurred. Please try again later.`);
            await interaction.editReply({ embeds: [embed] });
            console.log(`Error handling /fish: ${error}`);
        }
    },
};
