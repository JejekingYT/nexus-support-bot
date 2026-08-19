const { EmbedBuilder } = require("discord.js");

async function showTraining(interaction) {
    try {

        // =========================
        // CREATE EMBED
        // =========================

        const embed = new EmbedBuilder()
            .setTitle("🎓 Sanctuary Training")
            .setDescription(
                "Stay up to date with Sanctuary training sessions, requirements, and rewards."
            )
            .addFields(
                {
                    name: "📅 Training Schedule",
                    value:
                        "Training sessions will be announced here once a schedule has been established."
                },
                {
                    name: "👤 Who Can Attend?",
                    value:
                        "Training requirements will be announced soon."
                },
                {
                    name: "📍 Training Location",
                    value:
                        "The training location will be announced with each upcoming session."
                },
                {
                    name: "📋 What Happens During Training?",
                    value:
                        "Members will receive information about the training format, activities, and expectations before each session."
                },
                {
                    name: "🏆 Training Rewards",
                    value:
                        "Rewards and recognition for successful training participation will be announced soon."
                }
            )
            .setFooter({
                text: "The Sanctuary made by Nexus"
            })
            .setTimestamp();

        // =========================
        // SEND RESPONSE
        // =========================

        await interaction.reply({
            embeds: [embed]
        });

    } catch (error) {

        console.error(
            "❌ Training error:",
            error
        );

        try {

            if (interaction.replied) {

                await interaction.followUp({
                    content:
                        "❌ Something went wrong while loading the training information.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Something went wrong while loading the training information.",
                    ephemeral: true
                });

            }

        } catch {}
    }
}

module.exports = {
    showTraining
};