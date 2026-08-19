

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const {
    showRule,
    showAllRules
} = require("./commands/rules");

const {
    showRequirements
} = require("./commands/requirements");

const {
    showTraining
} = require("./commands/training");

const {
    showSchedule
} = require("./commands/schedule");

const {
    showEvents
} = require("./commands/events");

const {
    showReport,
    startReport
} = require("./commands/report");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = ";";

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content
        .slice(PREFIX.length)
        .trim()
        .split(/\s+/);

    const command = args.shift()?.toLowerCase();

    // ;help
    if (command === "help") {
        return message.reply(
            "🤖 **Sanctuary Support**\n\n" +
            "📜 **Information**\n" +
            "`;rules` — View all rules\n" +
            "`;rule <number>` — View a specific rule\n" +
            "`;requirements` — View requirements\n\n" +

            "🎓 **Clan Activities**\n" +
            "`;training` — Training information\n" +
            "`;schedule` — Upcoming schedule\n" +
            "`;events` — Clan events\n\n" +

            "🛠️ **Support**\n" +
            "`;apply` — Application information\n" +
            "`;report` — Report a member\n" +
            "`;appeal` — Appeal information"
        );
    }

    // ;rule <number>
    if (command === "rule") {
        const ruleNumber = args[0];

        if (!ruleNumber) {
            return message.reply(
                "❌ Please provide a rule number. Example: `;rule 2`"
            );
        }

        return showRule(message, ruleNumber);
    }

    // ;rules
    if (command === "rules") {
        return showAllRules(message);
    }

    // ;requirements
    if (command === "requirements") {
        return showRequirements(message);
    }

    // ;training
    if (command === "training") {
        return showTraining(message);
    }

    // ;schedule
    if (command === "schedule") {
        return showSchedule(message);
    }

    // ;events
    if (command === "events") {
        return showEvents(message);
    }

    // ;report
    if (command === "report") {
        return showReport(message);
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "start_report") {
        await startReport(interaction);
    }
});

console.log("🚀 Starting Sanctuary Assistant...");
console.log(
    "🔐 Token loaded:",
    process.env.DISCORD_TOKEN ? "YES" : "NO"
);

client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log("🔑 Login request sent to Discord.");
    })
    .catch((error) => {
        console.error("❌ Discord login failed:");
        console.error(error);
    });