const { EmbedBuilder } = require("discord.js");

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
        punishment: "Warning → Removed from the event."
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

module.exports = {
    rules,

    async showRule(message, ruleNumber) {
        const selectedRule = rules[ruleNumber];

        if (!selectedRule) {
            return message.reply(
                "❌ That rule does not exist. Please choose a rule between `1` and `10`."
            );
        }

        const embed = new EmbedBuilder()
            .setTitle(`📜 Sanctuary Rule #${ruleNumber}`)
            .setDescription(selectedRule.rule)
            .addFields({
                name: "⚖️ Punishment",
                value: selectedRule.punishment
            });

        await message.reply({ embeds: [embed] });
    },

    async showAllRules(message) {
        const embed = new EmbedBuilder()
            .setTitle("📜 Sanctuary Clan Rules")
            .setDescription("Use `;rule <number>` to view a specific rule.");

        for (const [number, data] of Object.entries(rules)) {
            embed.addFields({
                name: `Rule ${number}`,
                value: data.rule
            });
        }

        await message.reply({ embeds: [embed] });
    }
};