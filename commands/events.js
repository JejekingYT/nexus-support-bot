const { EmbedBuilder } = require("discord.js");
const { getEvents } = require("./addevent");

async function showEvents(interaction) {
    try {
        const events = getEvents();

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

        if (events.length === 0) {
            embed.addFields({
                name: "📅 Upcoming Events",
                value: "No events have been scheduled yet."
            });
        } else {
            for (const event of events) {
                embed.addFields({
                    name: `🎉 ${event.name}`,
                    value:
                        `📅 **Date:** ${event.date}\n` +
                        `🕐 **Time:** ${event.time}\n` +
                        `📍 **Location:** ${event.location}\n` +
                        `📝 **Description:** ${event.description}\n` +
                        `👤 **Created by:** <@${event.createdBy}>`
                });
            }
        }

        await interaction.reply({
            embeds: [embed]
        });

    } catch (error) {
        console.error(
            "❌ Events error:",
            error
        );

        if (!interaction.replied) {
            await interaction.reply({
                content:
                    "❌ Something went wrong while loading the events.",
                ephemeral: true
            });
        }
    }
}

module.exports = {
    showEvents
};