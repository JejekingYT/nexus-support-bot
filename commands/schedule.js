const { getEvents } = require("./addevent");

const {
    sanctuaryEmbed,
    errorEmbed
} = require("../utils/embeds");

async function showSchedule(interaction) {
    try {

        // =========================
        // GET EVENTS FROM MYSQL
        // =========================

        const events = await getEvents();

        // =========================
        // CREATE EMBED
        // =========================

        const embed = sanctuaryEmbed()
            .setTitle("📅 Sanctuary Schedule")
            .setDescription(
                "Everything happening within The Sanctuary."
            );

        // =========================
        // TRAININGS
        // =========================

        embed.addFields({
            name: "🎓 Trainings",
            value:
                "There are currently no trainings scheduled."
        });

        // =========================
        // RAIDS
        // =========================

        embed.addFields({
            name: "⚔️ Raids",
            value:
                "There are currently no raids scheduled."
        });

        // =========================
        // EVENTS
        // =========================

        if (events.length === 0) {

            embed.addFields({
                name: "🎉 Events",
                value:
                    "There are no events scheduled at the moment."
            });

        } else {

            const eventList = events
                .map(event =>
                    `> 🎉 **${event.name}**\n` +
                    `> 🆔 ${event.id}\n` +
                    `📅 **Date:** ${event.date}\n` +
                    `🕐 **Time:** ${event.time}\n` +
                    `📍 **Location:** ${event.location}`
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

        // =========================
        // SEND RESPONSE
        // =========================

        await interaction.reply({
            embeds: [embed]
        });

    } catch (error) {

        console.error(
            "❌ Schedule error:",
            error
        );

        const errorEmbedMessage = errorEmbed(
            "Unable to Load Schedule",
            "Something went wrong while loading the Sanctuary schedule.\n\n" +
            "Please try again later."
        );

        try {

            if (interaction.replied) {

                await interaction.followUp({
                    embeds: [errorEmbedMessage],
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    embeds: [errorEmbedMessage],
                    ephemeral: true
                });

            }

        } catch {}
    }
}

module.exports = {
    showSchedule
};