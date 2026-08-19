const fs = require("fs");
const path = require("path");

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const REPORT_CHANNEL_ID = "1539597296486850610";

const COUNTER_FILE = path.join(
    __dirname,
    "..",
    "data",
    "report-counter.json"
);

function getNextReportNumber() {
    let data = {
        lastReport: 0
    };

    try {
        if (fs.existsSync(COUNTER_FILE)) {
            data = JSON.parse(
                fs.readFileSync(COUNTER_FILE, "utf8")
            );
        }
    } catch (error) {
        console.error("Could not read report counter:", error);
    }

    data.lastReport++;

    try {
        fs.writeFileSync(
            COUNTER_FILE,
            JSON.stringify(data, null, 2)
        );
    } catch (error) {
        console.error("Could not save report counter:", error);
    }

    return `REPORT-${String(data.lastReport).padStart(3, "0")}`;
}

// /report
async function createReport(interaction) {
    try {
        const reportedMember =
            interaction.options.getMember("user");

        const reason =
            interaction.options.getString("reason");

        const priority =
            interaction.options.getString("priority") || "normal";

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

        let priorityText;

        if (priority === "low") {
            priorityText = "🟢 Low";
        } else if (priority === "high") {
            priorityText = "🔴 High";
        } else {
            priorityText = "🟡 Normal";
        }

        const reportId = getNextReportNumber();

        const reportChannel =
            await interaction.client.channels.fetch(
                REPORT_CHANNEL_ID
            );

        if (!reportChannel || !reportChannel.isTextBased()) {
            return interaction.reply({
                content:
                    "❌ The reports channel could not be found.",
                ephemeral: true
            });
        }

        const reporterName =
            interaction.member?.displayName ||
            interaction.user.displayName ||
            interaction.user.username;

        const reportedMemberText =
            `**${reportedMember.displayName}**\n` +
            `<@${reportedMember.id}>\n` +
            `@${reportedMember.user.username}`;

        const reportEmbed = new EmbedBuilder()
            .setTitle(`🚨 ${reportId} — New Member Report`)
            .setDescription(
                `A new report has been submitted by **${reporterName}**.`
            )
            .addFields(
                {
                    name: "👤 Reporter",
                    value:
                        `**${reporterName}**\n` +
                        `<@${interaction.user.id}>\n` +
                        `@${interaction.user.username}`
                },
                {
                    name: "🎯 Reported Member",
                    value: reportedMemberText
                },
                {
                    name: "🚨 Priority",
                    value: priorityText
                },
                {
                    name: "📝 Reason",
                    value: reason
                },
                {
                    name: "📌 Status",
                    value: "🟡 Unclaimed"
                }
            )
            .setTimestamp();

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("claim_report")
                .setLabel("Claim Report")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🟢"),

            new ButtonBuilder()
                .setCustomId("close_report")
                .setLabel("Close Report")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🔴")
        );

        await reportChannel.send({
            embeds: [reportEmbed],
            components: [buttons]
        });

        await interaction.reply({
            content:
                "✅ **Report submitted successfully!**\n\n" +
                `📋 Report ID: **${reportId}**\n` +
                `🎯 Reported: <@${reportedMember.id}>\n` +
                `🚨 Priority: **${priorityText}**`,
            ephemeral: true
        });

    } catch (error) {
        console.error("Report error:", error);

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

async function claimReport(interaction) {
    const message = interaction.message;

    if (!message.embeds.length) return;

    const embed = EmbedBuilder.from(message.embeds[0]);
    const fields = embed.data.fields || [];

    const statusField = fields.find(
        field => field.name === "📌 Status"
    );

    if (statusField && statusField.value !== "🟡 Unclaimed") {
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

    const newFields = fields.map(field => {
        if (field.name === "📌 Status") {
            return {
                name: "📌 Status",
                value: `🟢 Claimed by **${staffName}**\n<@${interaction.user.id}>`
            };
        }

        return field;
    });

    embed.setFields(newFields);

    await message.edit({
        embeds: [embed]
    });

    await interaction.reply({
        content: "🟢 You have claimed this report.",
        ephemeral: true
    });
}

async function closeReport(interaction) {
    const message = interaction.message;

    if (!message.embeds.length) return;

    const embed = EmbedBuilder.from(message.embeds[0]);
    const fields = embed.data.fields || [];

    const staffName =
        interaction.member?.displayName ||
        interaction.user.displayName ||
        interaction.user.username;

    const newFields = fields.map(field => {
        if (field.name === "📌 Status") {
            return {
                name: "📌 Status",
                value: `🔴 Closed by **${staffName}**\n<@${interaction.user.id}>`
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
        content: "🔴 Report closed.",
        ephemeral: true
    });
}

module.exports = {
    createReport,
    claimReport,
    closeReport
};