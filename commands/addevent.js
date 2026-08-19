const fs = require("fs");
const path = require("path");
const { PermissionFlagsBits } = require("discord.js");

const EVENTS_FILE = path.join(
    __dirname,
    "..",
    "data",
    "events.json"
);

function getEvents() {
    try {
        if (!fs.existsSync(EVENTS_FILE)) {
            return [];
        }

        return JSON.parse(
            fs.readFileSync(EVENTS_FILE, "utf8")
        );
    } catch (error) {
        console.error(
            "Could not read events:",
            error
        );

        return [];
    }
}

function saveEvents(events) {
    try {
        const dataFolder = path.dirname(
            EVENTS_FILE
        );

        if (!fs.existsSync(dataFolder)) {
            fs.mkdirSync(dataFolder, {
                recursive: true
            });
        }

        fs.writeFileSync(
            EVENTS_FILE,
            JSON.stringify(events, null, 2)
        );

        return true;
    } catch (error) {
        console.error(
            "Could not save events:",
            error
        );

        return false;
    }
}

async function addEvent(interaction) {

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
        // GET COMMAND OPTIONS
        // =========================

        const eventName =
            interaction.options.getString("name");

        const eventDate =
            interaction.options.getString("date");

        const eventTime =
            interaction.options.getString("time");

        const eventLocation =
            interaction.options.getString("location");

        const eventDescription =
            interaction.options.getString(
                "description"
            );

        // =========================
        // GET EXISTING EVENTS
        // =========================

        const events = getEvents();

        // =========================
        // CREATE EVENT
        // =========================

        const event = {
            id: Date.now(),
            name: eventName,
            date: eventDate,
            time: eventTime,
            location: eventLocation,
            description: eventDescription,
            createdBy: interaction.user.id,
            createdAt: new Date().toISOString()
        };

        events.push(event);

        // =========================
        // SAVE EVENT
        // =========================

        if (!saveEvents(events)) {
            return interaction.reply({
                content:
                    "❌ Something went wrong while saving the event.",
                ephemeral: true
            });
        }

        // =========================
        // SUCCESS
        // =========================

        await interaction.reply({
            content:
                "✅ **Event created successfully!**\n\n" +
                `🎉 **${event.name}**\n` +
                `📅 ${event.date}\n` +
                `🕐 ${event.time}\n` +
                `📍 ${event.location}\n` +
                `📝 ${event.description}`,
            ephemeral: true
        });

    } catch (error) {

        console.error(
            "❌ Add event error:",
            error
        );

        try {

            if (interaction.replied) {

                await interaction.followUp({
                    content:
                        "❌ Something went wrong while creating the event.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Something went wrong while creating the event.",
                    ephemeral: true
                });

            }

        } catch {}
    }
}

module.exports = {
    addEvent,
    getEvents
};