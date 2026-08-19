const { EmbedBuilder } = require("discord.js");
const { getEvents } = require("./addevent");

async function showSchedule(interaction) {
    try {
        const events = getEvents();

        const embed = new EmbedBuilder()
            .setTitle("📅 Sanctuary Schedule")
            .setDescription(
                "Here you can find upcoming Sanctuary clan activities."
            )
            .addFields(
                {
                    name: "🎓 Trainings",
                    value: "No trainings scheduled."
                },
                {
                    name: "⚔️ Raids",
                    value: "No raids scheduled."
                }
            );

        // =========================
        // EVENTS
        // =========================

        if (events.length === 0) {
            embed.addFields({
                name: "🎉 Events",
                value: "No events scheduled."
            });
        } else {
            const eventList = events
                .map(event =>
                    `🎉 **${event.name}**\n` +
                    `📅 ${event.date} at ${event.time}\n` +
                    `📍 ${event.location}`
                )
                .join("\n\n");

            embed.addFields({
                name: "🎉 Events",
                value: eventList
            });
        }

        // =========================
        // ANNOUNCEMENTS
        // =========================

        embed.addFields({
            name: "📢 Announcements",
            value:
                "All upcoming activities will be announced in the appropriate channels."
        });

        embed.setFooter({
            text: "The Sanctuary made by Nexus"
        });

        await interaction.reply({
            embeds: [embed]
        });

    } catch (error) {
        console.error(
            "❌ Schedule error:",
            error
        );

        if (!interaction.replied) {
            await interaction.reply({
                content:
                    "❌ Something went wrong while loading the schedule.",
                ephemeral: true
            });
        }
    }
}

module.exports = {
    showSchedule
};