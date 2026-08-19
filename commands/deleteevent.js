const {
    PermissionFlagsBits
} = require("discord.js");

const {
    getEvents
} = require("./addevent");

const {
    pool
} = require("../database");

// =========================
// DELETE EVENT
// =========================

async function deleteEvent(interaction) {

    // =========================
    // ADMINISTRATOR CHECK
    // =========================

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.Administrator
        )
    ) {
        return interaction.reply({
            content:
                "❌ You do not have permission to use this command.",
            ephemeral: true
        });
    }

    try {

        // =========================
        // GET EVENT ID
        // =========================

        const eventId =
            interaction.options.getString("event");

        if (!eventId) {
            return interaction.reply({
                content:
                    "❌ Please select an event to delete.",
                ephemeral: true
            });
        }

        // =========================
        // GET EVENTS FROM MYSQL
        // =========================

        const events =
            await getEvents();

        // =========================
        // FIND EVENT
        // =========================

        const event =
            events.find(
                event =>
                    String(event.id).toLowerCase() ===
                    String(eventId).toLowerCase()
            );

        if (!event) {
            return interaction.reply({
                content:
                    `❌ Event **${eventId}** could not be found.`,
                ephemeral: true
            });
        }

        // =========================
        // DELETE FROM MYSQL
        // =========================

        await pool.execute(
            `
            DELETE FROM events
            WHERE id = ?
            `,
            [event.id]
        );

        // =========================
        // SUCCESS
        // =========================

        await interaction.reply({
            content:
                "🗑️ **Event deleted successfully!**\n\n" +
                `🆔 **${event.id}**\n` +
                `🎉 **${event.name}**\n` +
                `📅 ${event.date}\n` +
                `🕐 ${event.time}`,
            ephemeral: true
        });

    } catch (error) {

        console.error(
            "❌ Delete event error:",
            error
        );

        try {

            if (interaction.replied) {

                await interaction.followUp({
                    content:
                        "❌ Something went wrong while deleting the event.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Something went wrong while deleting the event.",
                    ephemeral: true
                });

            }

        } catch {}
    }
}

module.exports = {
    deleteEvent
};