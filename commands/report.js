const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const REPORT_CHANNEL_ID = "1539597296486850610";

async function showReport(message) {
    const button = new ButtonBuilder()
        .setCustomId("start_report")
        .setLabel("Create Report")
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🚨");

    const row = new ActionRowBuilder().addComponents(button);

    await message.reply({
        content:
            "🚨 **Report a Member**\n\n" +
            "Click the button below to start a private report.\n" +
            "The bot will ask you questions in your DMs.",
        components: [row]
    });
}

async function askQuestion(dm, userId, question) {
    await dm.send(question);

    try {
        const collected = await dm.awaitMessages({
            filter: (msg) =>
                msg.author.id === userId && !msg.author.bot,
            max: 1,
            time: 300000,
            errors: ["time"]
        });

        return collected.first();
    } catch {
        await dm.send(
            "⌛ Your report timed out because no answer was received."
        );

        return null;
    }
}

async function startReport(interaction) {
    try {
        await interaction.reply({
            content:
                "📩 Check your DMs! The report questions have been sent to you.",
            ephemeral: true
        });

        const dm = await interaction.user.createDM();

        await dm.send(
            "🚨 **Nexus Report System**\n\n" +
            "Please answer the following questions honestly.\n" +
            "You have **5 minutes** to answer each question."
        );

        // Question 1
        const reportedUserAnswer = await askQuestion(
            dm,
            interaction.user.id,
            "👤 **Question 1/4:** Who are you reporting?\n" +
            "Please enter their exact Discord username.\n\n" +
            "Example: `Username123`"
        );

        if (!reportedUserAnswer) return;

        // Find the reported member
        const guild = interaction.guild;

        let reportedMember = null;

        if (guild) {
            try {
                reportedMember = await guild.members.fetch({
                    query: reportedUserAnswer.content,
                    limit: 10
                });

                // If fetch returns a collection, get the first result
                if (reportedMember && reportedMember.size > 0) {
                    reportedMember = reportedMember.first();
                } else {
                    reportedMember = null;
                }
            } catch {
                reportedMember = null;
            }

            // Try exact username/display name match
            if (!reportedMember) {
                const members = await guild.members.fetch();

                reportedMember = members.find(
                    (member) =>
                        member.user.username.toLowerCase() ===
                            reportedUserAnswer.content.toLowerCase() ||
                        member.displayName.toLowerCase() ===
                            reportedUserAnswer.content.toLowerCase()
                );
            }
        }

        let reportedMemberText;

        if (reportedMember) {
            reportedMemberText =
                `**${reportedMember.displayName}**\n` +
                `@${reportedMember.user.username}`;
        } else {
            reportedMemberText =
                `**${reportedUserAnswer.content}**\n` +
                `⚠️ Member could not be found in this server.`;
        }

        // Question 2
        const whatHappened = await askQuestion(
            dm,
            interaction.user.id,
            "📝 **Question 2/4:** What happened?\n" +
            "Please explain the situation."
        );

        if (!whatHappened) return;

        // Question 3
        const when = await askQuestion(
            dm,
            interaction.user.id,
            "📅 **Question 3/4:** When did this happen?"
        );

        if (!when) return;

        // Question 4
        const evidence = await askQuestion(
            dm,
            interaction.user.id,
            "📸 **Question 4/4:** Do you have any evidence?\n" +
            "Send links/screenshots or type `No evidence`."
        );

        if (!evidence) return;

        const reportChannel =
            await interaction.client.channels.fetch(REPORT_CHANNEL_ID);

        if (!reportChannel || !reportChannel.isTextBased()) {
            return dm.send(
                "❌ The reports channel could not be found."
            );
        }

        const reporterName =
            interaction.member?.displayName ||
            interaction.user.displayName ||
            interaction.user.username;

        const reportEmbed = new EmbedBuilder()
            .setTitle("🚨 New Member Report")
            .setDescription(
                `A new report has been submitted by **${reporterName}**.`
            )
            .addFields(
                {
                    name: "👤 Reporter",
                    value:
                        `**${reporterName}**\n` +
                        `@${interaction.user.username}`
                },
                {
                    name: "🎯 Reported Member",
                    value: reportedMemberText
                },
                {
                    name: "📝 What Happened",
                    value: whatHappened.content
                },
                {
                    name: "📅 When",
                    value: when.content
                },
                {
                    name: "📸 Evidence",
                    value: evidence.content
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

        await dm.send(
            "✅ **Your report has been submitted successfully.**\n\n" +
            "The Nexus staff team will review it."
        );

    } catch (error) {
        console.error("Report error:", error);

        try {
            await interaction.followUp({
                content:
                    "❌ Something went wrong. Please make sure your DMs are open.",
                ephemeral: true
            });
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
            content: "❌ This report has already been claimed.",
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
                value: `🟢 Claimed by **${staffName}**`
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
                value: `🔴 Closed by **${staffName}**`
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
    showReport,
    startReport,
    claimReport,
    closeReport
};