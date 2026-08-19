const { EmbedBuilder } = require("discord.js");

// =========================
// SANCTUARY BRANDING
// =========================

const FOOTER_TEXT = "The Sanctuary • Nexus";

// =========================
// BASE EMBED
// =========================

function sanctuaryEmbed() {
    return new EmbedBuilder()
        .setColor(0x5865F2)
        .setFooter({
            text: FOOTER_TEXT
        })
        .setTimestamp();
}

// =========================
// SUCCESS EMBED
// =========================

function successEmbed(title, description) {
    return sanctuaryEmbed()
        .setTitle(`✅ ${title}`)
        .setDescription(description);
}

// =========================
// ERROR EMBED
// =========================

function errorEmbed(title, description) {
    return sanctuaryEmbed()
        .setTitle(`❌ ${title}`)
        .setDescription(description);
}

// =========================
// INFO EMBED
// =========================

function infoEmbed(title, description) {
    return sanctuaryEmbed()
        .setTitle(`ℹ️ ${title}`)
        .setDescription(description);
}

// =========================
// WARNING EMBED
// =========================

function warningEmbed(title, description) {
    return sanctuaryEmbed()
        .setTitle(`⚠️ ${title}`)
        .setDescription(description);
}

// =========================
// EXPORTS
// =========================

module.exports = {
    sanctuaryEmbed,
    successEmbed,
    errorEmbed,
    infoEmbed,
    warningEmbed
};