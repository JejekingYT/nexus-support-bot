const { EmbedBuilder } = require("discord.js");

async function showTraining(interaction) {
    const embed = new EmbedBuilder()
        .setTitle("🎓 Sanctuary Training")
        .setDescription(
            "Information about Sanctuary trainings."
        )
        .addFields(
            {
                name: "📅 Training Schedule",
                value: "Training schedule will be announced soon."
            },
            {
                name: "👤 Who Can Attend?",
                value: "Training requirements will be announced soon."
            },
            {
                name: "📍 Where?",
                value: "Training location will be announced soon."
            },
            {
                name: "📋 What Happens During Training?",
                value: "Training information will be added soon."
            },
            {
                name: "🏆 Rewards",
                value: "Training rewards will be announced soon."
            }
        )
        .setFooter({
            text: "The Sanctuary made by Nexus"
        });

    await interaction.reply({
        embeds: [embed]
    });
}

module.exports = {
    showTraining
};