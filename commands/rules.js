const {
    sanctuaryEmbed,
    errorEmbed
} = require("../utils/embeds");

// =========================
// SANCTUARY RULES
// =========================

const rules = {
    1: {
        rule: "No exploiting, cheating, or hacking.",
        punishment: "Immediate permanent ban."
    },

    2: {
        rule: "No bullying, harassment, or hate speech.",
        punishment: "Warning → Timeout → Severe cases = Permanent ban."
    },

    3: {
        rule: "Do not spam chat or voice chat.",
        punishment: "Warning → Timeout → Kick."
    },

    4: {
        rule: "Listen to clan leaders and respect their orders to stop.",
        punishment: "Warning → Timeout → Kick."
    },

    5: {
        rule: "No inappropriate usernames, avatars, or content.",
        punishment: "Warning → Kick → Permanent Ban."
    },

    6: {
        rule: "Do not impersonate clan staff or higher ranks.",
        punishment: "Immediate kick. Repeated offense = Permanent ban."
    },

    7: {
        rule: "No begging for ranks, Robux, or admin.",
        punishment: "Warning → Timeout → Kick."
    },

    8: {
        rule: "Keep drama out of the clan.",
        punishment: "Warning → Timeout."
    },

    9: {
        rule: "Do not leak private clan information.",
        punishment: "Immediate permanent ban."
    },

    10: {
        rule: "Have fun and help keep the community friendly.",
        punishment: "None. Enjoy the clan!"
    }
};

// =========================
// /RULE
// =========================

async function showRule(interaction, ruleNumber) {

    try {

        const selectedRule = rules[ruleNumber];

        if (!selectedRule) {

            const embed = errorEmbed(
                "Rule Not Found",
                "That rule does not exist.\n\n" +
                "Please choose a rule between **1** and **10**."
            );

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        const embed = sanctuaryEmbed()
            .setTitle(`📜 Sanctuary Rule #${ruleNumber}`)
            .setDescription(
                `> ${selectedRule.rule}`
            )
            .addFields({
                name: "⚖️ Punishment",
                value: selectedRule.punishment
            });

        await interaction.reply({
            embeds: [embed]
        });

    } catch (error) {

        console.error(
            "❌ Rule error:",
            error
        );

        const embed = errorEmbed(
            "Unable to Load Rule",
            "Something went wrong while loading this rule.\n\n" +
            "Please try again later."
        );

        if (!interaction.replied) {

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        }
    }
}

// =========================
// /RULES
// =========================

async function showAllRules(interaction) {

    try {

        const embed = sanctuaryEmbed()
            .setTitle("📜 Sanctuary Clan Rules")
            .setDescription(
                "Please follow these rules to help keep The Sanctuary safe, respectful, and enjoyable for everyone.\n\n" +
                "Use `/rule <number>` to view a specific rule and its punishment."
            );

        for (const [number, data] of Object.entries(rules)) {

            embed.addFields({
                name: `📌 Rule ${number}`,
                value:
                    `${data.rule}\n` +
                    `> ⚖️ **Punishment:** ${data.punishment}`
            });

        }

        await interaction.reply({
            embeds: [embed]
        });

    } catch (error) {

        console.error(
            "❌ Rules error:",
            error
        );

        const embed = errorEmbed(
            "Unable to Load Rules",
            "Something went wrong while loading the Sanctuary rules.\n\n" +
            "Please try again later."
        );

        if (!interaction.replied) {

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        }
    }
}

// =========================
// EXPORTS
// =========================

module.exports = {
    rules,
    showRule,
    showAllRules
};