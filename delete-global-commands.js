const {
    REST,
    Routes
} = require("discord.js");

const rest = new REST({
    version: "10"
}).setToken(process.env.DISCORD_TOKEN);

async function deleteGlobalCommands() {
    try {
        console.log("🗑️ Deleting old global commands...");

        await rest.put(
            Routes.applicationCommands(
                process.env.DISCORD_CLIENT_ID
            ),
            {
                body: []
            }
        );

        console.log(
            "✅ Old global commands deleted!"
        );

    } catch (error) {
        console.error(
            "❌ Failed to delete global commands:",
            error
        );
    }
}

deleteGlobalCommands();