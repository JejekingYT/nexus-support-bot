const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const { pool } = require("../database");

const REPORT_CHANNEL_ID = "1539597296486850610";

// =========================
// GET NEXT REPORT NUMBER
// =========================

async function getNextReportNumber() {
    const connection = await pool.getConnection();

    try {

        await connection.query(`
            INSERT IGNORE INTO report_counter
            (id, lastReport)
            VALUES (1, 0)
        `);

        await connection.query(`
            UPDATE report_counter
            SET lastReport = LAST_INSERT_ID(lastReport + 1)
            WHERE id = 1
        `);

        const [rows] = await connection.query(`
            SELECT LAST_INSERT_ID() AS reportNumber
        `);

        const reportNumber = rows[0].reportNumber;

        return `REPORT-${String(reportNumber).padStart(3, "0")}`;

    } finally {
        connection.release();
    }
}

// =========================
// /REPORT
// =========================

async function createReport(interaction) {

    try {

        const reportedMember =
            interaction.options.getMember("user");

        const reason =
            interaction.options.getString("reason");

        const priority =
            interaction.options.getString("priority") || "normal";

        // =========================
        // VALIDATION
        // =========================

        if (!reportedMember) {
            return interaction.reply({
                content:
                    "❌ I could not find that member in this server.",
                ephemeral: true
            });
        }

        if (reportedMember.user.bot) {
            return interaction.reply({
                content:
                    "❌ You cannot report a bot.",
                ephemeral: true
            });
        }

        if (reportedMember.id === interaction.user.id) {
            return interaction.reply({
                content:
                    "❌ You cannot report yourself.",
                ephemeral: true
            });
        }

        // =========================
        // PRIORITY
        // =========================

        let priorityText;

        if (priority === "low") {
            priorityText = "🟢 Low";
        } else if (priority === "high") {
            priorityText = "🔴 High";
        } else {
            priorityText = "🟡 Normal";
        }

        // =========================
        // GENERATE REPORT ID
        // =========================

        const reportId =
            await getNextReportNumber();

        // =========================
        // REPORT CHANNEL
        // =========================

        const reportChannel =
            await interaction.client.channels.fetch(
                REPORT_CHANNEL_ID
            );

        if (
            !reportChannel ||
            !reportChannel.isTextBased()
        ) {
            return interaction.reply({
                content:
                    "❌ The reports channel could not be found.",
                ephemeral: true
            });
        }

        // =========================
        // NAMES
        // =========================

        const reporterName =
            interaction.member?.displayName ||
            interaction.user.displayName ||
            interaction.user.username;

        // =========================
        // REPORT EMBED
        // =========================

        const reportEmbed =
            new EmbedBuilder()
                .setTitle(
                    `🚨 ${reportId} — Member Report`
                )
                .setDescription(
                    "A new member report has been submitted and requires staff attention."
                )
                .addFields(
                    {
                        name: "👤 Reporter",
                        value:
                            `**${reporterName}**\n` +
                            `<@${interaction.user.id}>\n` +
                            `\`${interaction.user.username}\``,
                        inline: true
                    },
                    {
                        name: "🎯 Reported Member",
                        value:
                            `**${reportedMember.displayName}**\n` +
                            `<@${reportedMember.id}>\n` +
                            `\`${reportedMember.user.username}\``,
                        inline: true
                    },
                    {
                        name: "🚨 Priority",
                        value:
                            priorityText,
                        inline: true
                    },
                    {
                        name: "📝 Report Reason",
                        value:
                            reason
                    },
                    {
                        name: "📌 Status",
                        value:
                            "🟡 **Unclaimed**\n" +
                            "Waiting for a staff member to review this report.",
                        inline: false
                    }
                )
                .setFooter({
                    text: "The Sanctuary made by Nexus"
                })
                .setTimestamp();

        // =========================
        // BUTTONS
        // =========================

        const buttons =
            new ActionRowBuilder()
                .addComponents(

                    new ButtonBuilder()
                        .setCustomId(
                            "claim_report"
                        )
                        .setLabel(
                            "Claim Report"
                        )
                        .setStyle(
                            ButtonStyle.Success
                        )
                        .setEmoji("🟢"),

                    new ButtonBuilder()
                        .setCustomId(
                            "close_report"
                        )
                        .setLabel(
                            "Close Report"
                        )
                        .setStyle(
                            ButtonStyle.Danger
                        )
                        .setEmoji("🔴")
                );

        // =========================
        // SEND REPORT
        // =========================

        await reportChannel.send({
            embeds: [reportEmbed],
            components: [buttons]
        });

        // =========================
        // USER CONFIRMATION
        // =========================

        await interaction.reply({
            content:
                "✅ **Report submitted successfully!**\n\n" +
                `📋 **Report ID:** ${reportId}\n` +
                `🎯 **Reported:** <@${reportedMember.id}>\n` +
                `🚨 **Priority:** ${priorityText}\n\n` +
                "Staff will review your report as soon as possible.",
            ephemeral: true
        });

    } catch (error) {

        console.error(
            "❌ Report error:",
            error
        );

        try {

            if (interaction.replied) {

                await interaction.followUp({
                    content:
                        "❌ Something went wrong while submitting the report.",
                    ephemeral: true
                });

            } else {

                await interaction.reply({
                    content:
                        "❌ Something went wrong while submitting the report.",
                    ephemeral: true
                });

            }

        } catch {}
    }
}

// =========================
// CLAIM REPORT
// =========================

async function claimReport(interaction) {

    const message =
        interaction.message;

    if (!message.embeds.length) {
        return;
    }

    const embed =
        EmbedBuilder.from(
            message.embeds[0]
        );

    const fields =
        embed.data.fields || [];

    const statusField =
        fields.find(
            field =>
                field.name === "📌 Status"
        );

    if (
        statusField &&
        !statusField.value.startsWith(
            "🟡 **Unclaimed**"
        )
    ) {

        return interaction.reply({
            content:
                "❌ This report has already been claimed or closed.",
            ephemeral: true
        });
    }

    const staffName =
        interaction.member?.displayName ||
        interaction.user.displayName ||
        interaction.user.username;

    const newFields =
        fields.map(field => {

            if (
                field.name === "📌 Status"
            ) {

                return {
                    name: "📌 Status",
                    value:
                        `🟢 **Claimed**\n` +
                        `Handled by **${staffName}**\n` +
                        `<@${interaction.user.id}>`
                };

            }

            return field;
        });

    embed.setFields(newFields);

    await message.edit({
        embeds: [embed]
    });

    await interaction.reply({
        content:
            "🟢 **Report claimed successfully.**\nYou are now handling this report.",
        ephemeral: true
    });
}

// =========================
// CLOSE REPORT
// =========================

async function closeReport(interaction) {

    const message =
        interaction.message;

    if (!message.embeds.length) {
        return;
    }

    const embed =
        EmbedBuilder.from(
            message.embeds[0]
        );

    const fields =
        embed.data.fields || [];

    const staffName =
        interaction.member?.displayName ||
        interaction.user.displayName ||
        interaction.user.username;

    const newFields =
        fields.map(field => {

            if (
                field.name === "📌 Status"
            ) {

                return {
                    name: "📌 Status",
                    value:
                        `🔴 **Closed**\n` +
                        `Closed by **${staffName}**\n` +
                        `<@${interaction.user.id}>`
                };

            }

            return field;
        });

    embed.setFields(newFields);

    await message.edit({
        embeds: [embed],
        components: []
    });

    await interaction.reply({
        content:
            "🔴 **Report closed successfully.**",
        ephemeral: true
    });
}

// =========================
// EXPORTS
// =========================

module.exports = {
    createReport,
    claimReport,
    closeReport
};