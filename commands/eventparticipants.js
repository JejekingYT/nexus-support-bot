const {
    EmbedBuilder
} = require("discord.js");

const { pool } =
    require("../database");

// =========================
// GET PARTICIPANT COUNT
// =========================

async function getParticipantCount(
    eventId
) {

    const [rows] =
        await pool.execute(
            `
            SELECT COUNT(*) AS count
            FROM event_participants
            WHERE eventId = ?
            `,
            [eventId]
        );

    return rows[0].count;
}

// =========================
// UPDATE EVENT EMBED
// =========================

async function updateEventMessage(
    message,
    eventId
) {

    const count =
        await getParticipantCount(
            eventId
        );

    const embed =
        EmbedBuilder.from(
            message.embeds[0]
        );

    const fields =
        embed.data.fields || [];

    const newFields =
        fields.map(field => {

            if (
                field.name === "👥 Participants"
            ) {
                return {
                    ...field,
                    value:
                        `${count} member${count === 1 ? "" : "s"} joined`
                };
            }

            return field;
        });

    embed.setFields(
        newFields
    );

    await message.edit({
        embeds: [embed]
    });
}

// =========================
// JOIN EVENT
// =========================

async function joinEvent(
    interaction,
    eventId
) {

    try {

        const [existing] =
            await pool.execute(
                `
                SELECT *
                FROM event_participants
                WHERE eventId = ?
                AND userId = ?
                `,
                [
                    eventId,
                    interaction.user.id
                ]
            );

        if (
            existing.length > 0
        ) {
            return interaction.reply({
                content:
                    "❌ You have already joined this event.",
                ephemeral: true
            });
        }

        await pool.execute(
            `
            INSERT INTO event_participants (
                eventId,
                userId,
                joinedAt
            )
            VALUES (?, ?, ?)
            `,
            [
                eventId,
                interaction.user.id,
                new Date()
            ]
        );

        await updateEventMessage(
            interaction.message,
            eventId
        );

        await interaction.reply({
            content:
                "🟢 You successfully joined this event!",
            ephemeral: true
        });

    } catch (error) {

        console.error(
            "❌ Join event error:",
            error
        );

        await interaction.reply({
            content:
                "❌ Something went wrong while joining the event.",
            ephemeral: true
        });
    }
}

// =========================
// LEAVE EVENT
// =========================

async function leaveEvent(
    interaction,
    eventId
) {

    try {

        const [result] =
            await pool.execute(
                `
                DELETE FROM event_participants
                WHERE eventId = ?
                AND userId = ?
                `,
                [
                    eventId,
                    interaction.user.id
                ]
            );

        if (
            result.affectedRows === 0
        ) {
            return interaction.reply({
                content:
                    "❌ You have not joined this event.",
                ephemeral: true
            });
        }

        await updateEventMessage(
            interaction.message,
            eventId
        );

        await interaction.reply({
            content:
                "🔴 You have left this event.",
            ephemeral: true
        });

    } catch (error) {

        console.error(
            "❌ Leave event error:",
            error
        );

        await interaction.reply({
            content:
                "❌ Something went wrong while leaving the event.",
            ephemeral: true
        });
    }
}

// =========================
// VIEW PARTICIPANTS
// =========================

async function viewParticipants(
    interaction,
    eventId
) {

    try {

        const [participants] =
            await pool.execute(
                `
                SELECT userId
                FROM event_participants
                WHERE eventId = ?
                ORDER BY joinedAt ASC
                `,
                [eventId]
            );

        if (
            participants.length === 0
        ) {
            return interaction.reply({
                content:
                    "👥 No one has joined this event yet.",
                ephemeral: true
            });
        }

        const participantList =
            participants
                .map(
                    participant =>
                        `<@${participant.userId}>`
                )
                .join("\n");

        const embed =
            new EmbedBuilder()
                .setTitle(
                    "👥 Event Participants"
                )
                .setDescription(
                    participantList
                )
                .setFooter({
                    text:
                        `${participants.length} participant${participants.length === 1 ? "" : "s"}`
                });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    } catch (error) {

        console.error(
            "❌ View participants error:",
            error
        );

        await interaction.reply({
            content:
                "❌ Something went wrong while loading participants.",
            ephemeral: true
        });
    }
}

module.exports = {
    joinEvent,
    leaveEvent,
    viewParticipants
};