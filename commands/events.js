const { EmbedBuilder } = require("discord.js");

async function showEvents(message) {
    const embed = new EmbedBuilder()
        .setTitle("🎉 Sanctuary Events")
        .setDescription(
            "Information about upcoming Sanctuary events."
        )
        .addFields(
            {
                name: "📅 Upcoming Events",
                value: "Upcoming events will be announced soon."
            },
            {
                name: "👥 Who Can Participate?",
                value: "Event participation requirements will be announced soon."
            },
            {
                name: "📍 Where?",
                value: "Event locations will be announced soon."
            },
            {
                name: "🎮 What Happens During Events?",
                value: "Event information will be added soon."
            },
            {
                name: "🏆 Rewards",
                value: "Event rewards will be announced soon."
            }
        )
        .setFooter({
            text: "The Sanctuary made by Nexus"
        });

    await message.reply({ embeds: [embed] });
}

module.exports = {
    showEvents
};