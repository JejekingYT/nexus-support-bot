const { EmbedBuilder } = require("discord.js");

async function showSchedule(message) {
    const embed = new EmbedBuilder()
        .setTitle("📅 Sanctuary Schedule")
        .setDescription(
            "Here you can find upcoming Sanctuary clan activities."
        )
        .addFields(
            {
                name: "🎓 Trainings",
                value: "No trainings scheduled."
            },
            {
                name: "⚔️ Raids",
                value: "No raids scheduled."
            },
            {
                name: "🎉 Events",
                value: "No events scheduled."
            },
            {
                name: "📢 Announcements",
                value: "All upcoming activities will be announced in the appropriate channels."
            }
        )
        .setFooter({
            text: "The Sanctuary made by Nexus"
        });

    await message.reply({ embeds: [embed] });
}

module.exports = {
    showSchedule
};