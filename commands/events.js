const { getEvents } = require("./addevent");

const {
    sanctuaryEmbed,
    errorEmbed
} = require("../utils/embeds");

async function showEvents(interaction) {
    try {

        // =========================
        // GET EVENTS FROM MYSQL
        // =========================

        const events = await getEvents();

        // =========================
        // CREATE EMBED
        // =========================

        const embed = sanctuaryEmbed()
            .setTitle("🎉 Sanctuary Events")
            .setDescription(
                events.length > 0
                    ? "Here are the upcoming events within The Sanctuary."
                    : "There are currently no upcoming events."
            );

        // =========================
        // NO EVENTS
        // =========================

        if (events.length === 0) {

            embed.addFields({
                name: "📅 Upcoming Events",
                value:
                    "There are no events scheduled at the moment.\n\n" +
                    "Check back later for new activities."
            });

        } else {

            // =========================
            // DISPLAY EVENTS
            // =========================

            for (const event of events) {

                embed.addFields({
                    name: `🎉 ${event.name}`,
                    value:
                        `> 🆔 **${event.id}**\n` +
                        `📅 **Date:** ${event.date}\n` +
                        `🕐 **Time:** ${event.time}\n` +
                        `📍 **Location:** ${event.location}\n\n` +
                        `📝 **Description**\n` +
                        `${event.description}\n\n` +
                        `👤 **Created by:** <@${event.createdBy}>`
                });

            }
        }

        // =========================
        // SEND RESPONSE
        // =========================

        await interaction.reply({
            embeds: [embed]
        });

    } catch (error) {

        console.error(
            "❌ Events error:",
            error
        );

        const errorEmbedMessage = errorEmbed(
            "Unable to Load Events",
            "Something went wrong while loading the Sanctuary events.\n\n" +
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
    showEvents
};