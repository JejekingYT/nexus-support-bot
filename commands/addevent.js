const { PermissionFlagsBits } = require("discord.js");
const { pool } = require("../database");

// =========================
// GET EVENTS
// =========================

async function getEvents() {
    try {

        const [rows] = await pool.query(`
            SELECT
                id,
                name,
                date,
                time,
                location,
                description,
                createdBy,
                createdAt
            FROM events
            ORDER BY date ASC, time ASC
        `);

        return rows;

    } catch (error) {

        console.error(
            "❌ Could not read events from MySQL:",
            error
        );

        return [];
    }
}

// =========================
// GET NEXT EVENT ID
// =========================

async function getNextEventId() {

    try {

        const [rows] = await pool.query(`
            SELECT id
            FROM events
            WHERE id LIKE 'EVENT-%'
            ORDER BY id DESC
            LIMIT 1
        `);

        if (rows.length === 0) {
            return "EVENT-001";
        }

        const lastId = String(rows[0].id);

        const number = parseInt(
            lastId.replace("EVENT-", ""),
            10
        );

        if (isNaN(number)) {
            return "EVENT-001";
        }

        return `EVENT-${String(
            number + 1
        ).padStart(3, "0")}`;

    } catch (error) {

        console.error(
            "❌ Could not generate event ID:",
            error
        );

        return `EVENT-${Date.now()}`;
    }
}

// =========================
// ADD EVENT
// =========================

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
            interaction.options.getString("description");

        // =========================
        // CREATE EVENT ID
        // =========================

        const eventId =
            await getNextEventId();

        // =========================
        // SAVE TO MYSQL
        // =========================

        await pool.execute(
            `
            INSERT INTO events (
                id,
                name,
                date,
                time,
                location,
                description,
                createdBy,
                createdAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                eventId,
                eventName,
                eventDate,
                eventTime,
                eventLocation,
                eventDescription,
                interaction.user.id,
                new Date()
            ]
        );

        // =========================
        // SUCCESS
        // =========================

        await interaction.reply({
            content:
                "✅ **Event created successfully!**\n\n" +
                `🆔 **${eventId}**\n` +
                `🎉 **${eventName}**\n` +
                `📅 ${eventDate}\n` +
                `🕐 ${eventTime}\n` +
                `📍 ${eventLocation}\n` +
                `📝 ${eventDescription}`,
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