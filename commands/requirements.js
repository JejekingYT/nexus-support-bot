const { EmbedBuilder } = require("discord.js");

async function showRequirements(message) {
    const embed = new EmbedBuilder()
        .setTitle("📋 Sanctuary Requirements")
        .setDescription(
            "Here are the requirements for ranking up and being part of the Sanctuary."
        )
        .addFields(
            {
                name: "📈 Rank-Up Requirements",
                value:
                    "• Attend trainings\n" +
                    "• Participate in events\n" +
                    "• Be active\n" +
                    "• Follow the rules"
            },
            {
                name: "🛡️ Clan Requirements",
                value:
                    "• Must be in the Roblox group\n" +
                    "• Must be respectful"
            }
        )
        .setFooter({
            text: "The Sanctuary made by Nexus"
        });

    await message.reply({ embeds: [embed] });
}

module.exports = {
    showRequirements
};