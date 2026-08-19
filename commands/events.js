const { EmbedBuilder } = require("discord.js");
const { getEvents } = require("./addevent");

async function showEvents(interaction) {
    try {

        // =========================
        // GET EVENTS FROM MYSQL
        // =========================

        const events = await getEvents();

        // =========================
        // CREATE EMBED
        // =========================

        const embed = new EmbedBuilder()
            .setTitle("🎉 Sanctuary Events")
            .setDescription(
                events.length > 0
                    ? "Here are the upcoming Sanctuary events."
                    : "There are currently no upcoming events."
            )
            .setFooter({
                text: "The Sanctuary made by Nexus"
            })
            .setTimestamp();

        // =========================
        // NO EVENTS
        // =========================

        if (events.length === 0) {

            embed.addFields({
                name: "📅 Upcoming Events",
                value: "No events have been scheduled yet."
            });

        } else {

            // =========================
            // DISPLAY EVENTS
            // =========================

            for (const event of events) {

                embed.addFields({
                    name: `🎉 ${event.name}`,
                    value:
                        `🆔 **ID:** ${event.id}\n` +
                        `📅 **Date:** ${event.date}\n` +
                        `🕐 **Time:** ${event.time}\n` +
                        `📍 **Location:** ${event.location}\n` +
                        `📝 **Description:** ${event.description}\n` +
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

        try {

            if (interaction.replied) {

                await interaction.followUp({
                    content:
                        "❌ Something went wrong while loading the events.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Something went wrong while loading the events.",
                    ephemeral: true
                });

            }

        } catch {}
    }
}

module.exports = {
    showEvents
};