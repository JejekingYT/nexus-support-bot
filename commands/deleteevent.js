const {
    PermissionFlagsBits
} = require("discord.js");

const {
    getEvents,
    saveEvents
} = require("./addevent");

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
            interaction.options.getString("id");

        const events = getEvents();

        // =========================
        // FIND EVENT
        // =========================

        const eventIndex =
            events.findIndex(
                event =>
                    event.id.toString().toLowerCase() ===
                    eventId.toLowerCase()
            );

        if (eventIndex === -1) {
            return interaction.reply({
                content:
                    `❌ Event **${eventId}** could not be found.`,
                ephemeral: true
            });
        }

        // =========================
        // REMOVE EVENT
        // =========================

        const deletedEvent =
            events[eventIndex];

        events.splice(
            eventIndex,
            1
        );

        // =========================
        // SAVE
        // =========================

        if (!saveEvents(events)) {
            return interaction.reply({
                content:
                    "❌ Something went wrong while deleting the event.",
                ephemeral: true
            });
        }

        // =========================
        // SUCCESS
        // =========================

        await interaction.reply({
            content:
                "🗑️ **Event deleted successfully!**\n\n" +
                `🆔 **${deletedEvent.id}**\n` +
                `🎉 **${deletedEvent.name}**\n` +
                `📅 ${deletedEvent.date}\n` +
                `🕐 ${deletedEvent.time}`,
            ephemeral: true
        });

    } catch (error) {

        console.error(
            "❌ Delete event error:",
            error
        );

        if (!interaction.replied) {
            await interaction.reply({
                content:
                    "❌ Something went wrong while deleting the event.",
                ephemeral: true
            });
        }
    }
}

module.exports = {
    deleteEvent
};