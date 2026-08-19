require("dotenv").config();
const {
    REST,
    Routes
} = require("discord.js");

const rest = new REST({
    version: "10"
}).setToken(process.env.DISCORD_TOKEN);

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

async function clearCommands() {
    try {
        console.log("🗑️ Clearing global commands...");

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {
                body: []
            }
        );

        console.log("✅ Global commands cleared!");

        console.log("🗑️ Clearing guild commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: []
            }
        );

        console.log("✅ Guild commands cleared!");
        console.log("🎉 All slash commands have been cleared!");

    } catch (error) {
        console.error(
            "❌ Failed to clear commands:",
            error
        );
    }
}

clearCommands();