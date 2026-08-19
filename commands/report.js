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
            filter: (msg) => {
                return msg.author.id === userId && !msg.author.bot;
            },
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
            content: "📩 Check your DMs! The report questions have been sent to you.",
            ephemeral: true
        });

        const dm = await interaction.user.createDM();

        await dm.send(
            "🚨 **Sanctuary Report System**\n\n" +
            "Please answer the following questions honestly.\n" +
            "You have **5 minutes** to answer each question."
        );

        const reportedUser = await askQuestion(
            dm,
            interaction.user.id,
            "👤 **Question 1/4:** Who are you reporting?\nPlease provide their username."
        );

        if (!reportedUser) return;

        const whatHappened = await askQuestion(
            dm,
            interaction.user.id,
            "📝 **Question 2/4:** What happened?\nPlease explain the situation."
        );

        if (!whatHappened) return;

        const when = await askQuestion(
            dm,
            interaction.user.id,
            "📅 **Question 3/4:** When did this happen?"
        );

        if (!when) return;

        const evidence = await askQuestion(
            dm,
            interaction.user.id,
            "📸 **Question 4/4:** Do you have any evidence?\nYou can send links or screenshots, or type `No evidence`."
        );

        if (!evidence) return;

        const reportChannel = await interaction.client.channels.fetch(
            REPORT_CHANNEL_ID
        );

        if (!reportChannel || !reportChannel.isTextBased()) {
            return dm.send(
                "❌ The reports channel could not be found."
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
                    value: reportedUser.content
                },
                {
                    name: "What Happened",
                    value: whatHappened.content
                },
                {
                    name: "When",
                    value: when.content
                },
                {
                    name: "Evidence",
                    value: evidence.content
                }
            )
            .setTimestamp();

        await reportChannel.send({
            embeds: [reportEmbed]
        });

        await dm.send(
            "✅ **Your report has been submitted successfully.**\n\n" +
            "The staff team will review it."
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

module.exports = {
    showReport,
    startReport
};