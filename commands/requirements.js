const { EmbedBuilder } = require("discord.js");

async function showRequirements(interaction) {

    const embed = new EmbedBuilder()
        .setTitle("📋 Sanctuary Requirements")
        .setDescription(
            "Everything you need to know about becoming and progressing as a member of **The Sanctuary**."
        )
        .addFields(
            {
                name: "📈 Rank-Up Requirements",
                value:
                    "🎓 **Attend trainings**\n" +
                    "🎉 **Participate in events**\n" +
                    "🟢 **Stay active within the community**\n" +
                    "📜 **Follow all Sanctuary rules**",
                inline: false
            },
            {
                name: "🛡️ Clan Requirements",
                value:
                    "👥 **Be a member of the Roblox group**\n" +
                    "🤝 **Respect other members and staff**\n" +
                    "📜 **Follow the Sanctuary rules**",
                inline: false
            },
            {
                name: "⭐ What We Look For",
                value:
                    "We value **activity, teamwork, discipline, and respect**. " +
                    "Members who consistently contribute to the community have the best opportunities to progress.",
                inline: false
            }
        )
        .setFooter({
            text: "The Sanctuary made by Nexus"
        })
        .setTimestamp();

    await interaction.reply({
        embeds: [embed]
    });
}

module.exports = {
    showRequirements
};