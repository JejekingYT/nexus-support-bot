const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ComponentType
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

async function startReport(interaction) {
    await interaction.deferReply({
        ephemeral: true
    });

    try {
        await interaction.user.send(
            "🚨 **Sanctuary Report System**\n\n" +
            "You are starting a report. Please answer the questions honestly."
        );

        await interaction.editReply(
            "📩 Check your DMs! The report questions have been sent to you."
        );

        const dm = await interaction.user.createDM();

        const questions = [
            "👤 **Who are you reporting?**\nPlease provide their username.",
            "📝 **What happened?**\nPlease explain the situation.",
            "📅 **When did this happen?**",
            "📸 **Do you have any evidence?**\nSend links, screenshots, or type `No evidence`."
        ];

        const answers = [];

        for (const question of questions) {
            await dm.send(question);

            const collected = await dm.awaitMessages({
                filter: (msg) =>
                    msg.author.id === interaction.user.id,
                max: 1,
                time: 300000,
                errors: ["time"]
            });

            answers.push(collected.first().content);
        }

        const reportChannel =
            await interaction.client.channels.fetch(REPORT_CHANNEL_ID);

        if (!reportChannel) {
            return dm.send(
                "❌ The report system could not find the reports channel."
            );
        }

        const reportEmbed = new EmbedBuilder()
            .setTitle("🚨 New Member Report")
            .addFields(
                {
                    name: "Reporter",
                    value: `${interaction.user.tag} (${interaction.user.id})`
                },
                {
                    name: "Reported Member",
                    value: answers[0]
                },
                {
                    name: "What Happened",
                    value: answers[1]
                },
                {
                    name: "When",
                    value: answers[2]
                },
                {
                    name: "Evidence",
                    value: answers[3]
                }
            )
            .setTimestamp();

        await reportChannel.send({
            embeds: [reportEmbed]
        });

        await dm.send(
            "✅ **Your report has been submitted successfully.**\n\n" +
            "The Nexus staff team will review it."
        );

    } catch (error) {
        console.error("Report error:", error);

        try {
            await interaction.editReply(
                "❌ I couldn't start the report. Please make sure your DMs are open."
            );
        } catch {}
    }
}

module.exports = {
    showReport,
    startReport
};