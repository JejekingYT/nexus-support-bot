const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder
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
    createReport,
    claimReport,
    closeReport
} = require("./commands/report");

const {
    addEvent
} = require("./commands/addevent");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// =========================
// SLASH COMMANDS
// =========================

const commands = [

    // /help
    new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "View all available Sanctuary commands"
        ),

    // /rules
    new SlashCommandBuilder()
        .setName("rules")
        .setDescription(
            "View all Sanctuary rules"
        ),

    // /rule
    new SlashCommandBuilder()
        .setName("rule")
        .setDescription(
            "View a specific Sanctuary rule"
        )
        .addIntegerOption(option =>
            option
                .setName("number")
                .setDescription(
                    "The rule number"
                )
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(10)
        ),

    // /requirements
    new SlashCommandBuilder()
        .setName("requirements")
        .setDescription(
            "View Sanctuary requirements"
        ),

    // /training
    new SlashCommandBuilder()
        .setName("training")
        .setDescription(
            "View Sanctuary training information"
        ),

    // /schedule
    new SlashCommandBuilder()
        .setName("schedule")
        .setDescription(
            "View the Sanctuary schedule"
        ),

    // /events
    new SlashCommandBuilder()
        .setName("events")
        .setDescription(
            "View upcoming Sanctuary events"
        ),

    // /report
    new SlashCommandBuilder()
        .setName("report")
        .setDescription(
            "Report a member"
        )
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription(
                    "The member you want to report"
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription(
                    "Why are you reporting this member?"
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("priority")
                .setDescription(
                    "How serious is this report?"
                )
                .setRequired(true)
                .addChoices(
                    {
                        name: "🟢 Low",
                        value: "low"
                    },
                    {
                        name: "🟡 Normal",
                        value: "normal"
                    },
                    {
                        name: "🔴 High",
                        value: "high"
                    }
                )
        ),

    // /addevent
    new SlashCommandBuilder()
        .setName("addevent")
        .setDescription(
            "Create a new Sanctuary event"
        )
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription(
                    "Name of the event"
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription(
                    "Date of the event"
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription(
                    "Time of the event"
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("location")
                .setDescription(
                    "Where the event takes place"
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription(
                    "Description of the event"
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions("8")

].map(command => command.toJSON());

// =========================
// REGISTER COMMANDS
// =========================

async function registerCommands() {
    try {
        const rest = new REST({
            version: "10"
        }).setToken(
            process.env.DISCORD_TOKEN
        );

        console.log(
            "🔄 Registering slash commands..."
        );

        await rest.put(
            Routes.applicationCommands(
                client.user.id
            ),
            {
                body: commands
            }
        );

        console.log(
            "✅ Slash commands registered successfully!"
        );

    } catch (error) {
        console.error(
            "❌ Failed to register slash commands:",
            error
        );
    }
}

// =========================
// BOT READY
// =========================

client.once("ready", async () => {
    console.log(
        `✅ ${client.user.tag} is online!`
    );

    await registerCommands();
});

// =========================
// INTERACTIONS
// =========================

client.on(
    "interactionCreate",
    async interaction => {

        // =========================
        // SLASH COMMANDS
        // =========================

        if (interaction.isChatInputCommand()) {

            try {

                // /help
                if (
                    interaction.commandName === "help"
                ) {
                    return interaction.reply(
                        "🤖 **Sanctuary Support**\n\n" +

                        "📜 **Information**\n" +
                        "`/rules` — View all rules\n" +
                        "`/rule <number>` — View a specific rule\n" +
                        "`/requirements` — View requirements\n\n" +

                        "🎓 **Clan Activities**\n" +
                        "`/training` — Training information\n" +
                        "`/schedule` — Upcoming schedule\n" +
                        "`/events` — Clan events\n\n" +

                        "🛠️ **Support**\n" +
                        "`/report` — Report a member\n\n" +

                        "🔐 **Administration**\n" +
                        "`/addevent` — Create a new event"
                    );
                }

                // /rule
                if (
                    interaction.commandName === "rule"
                ) {
                    const ruleNumber =
                        interaction.options.getInteger(
                            "number"
                        );

                    return showRule(
                        interaction,
                        ruleNumber
                    );
                }

                // /rules
                if (
                    interaction.commandName === "rules"
                ) {
                    return showAllRules(
                        interaction
                    );
                }

                // /requirements
                if (
                    interaction.commandName === "requirements"
                ) {
                    return showRequirements(
                        interaction
                    );
                }

                // /training
                if (
                    interaction.commandName === "training"
                ) {
                    return showTraining(
                        interaction
                    );
                }

                // /schedule
                if (
                    interaction.commandName === "schedule"
                ) {
                    return showSchedule(
                        interaction
                    );
                }

                // /events
                if (
                    interaction.commandName === "events"
                ) {
                    return showEvents(
                        interaction
                    );
                }

                // /report
                if (
                    interaction.commandName === "report"
                ) {
                    return createReport(
                        interaction
                    );
                }

                // /addevent
                if (
                    interaction.commandName === "addevent"
                ) {
                    return addEvent(
                        interaction
                    );
                }

            } catch (error) {

                console.error(
                    "❌ Slash command error:",
                    error
                );

                try {

                    if (interaction.replied) {

                        await interaction.followUp({
                            content:
                                "❌ Something went wrong while executing this command.",
                            ephemeral: true
                        });

                    } else {

                        await interaction.reply({
                            content:
                                "❌ Something went wrong while executing this command.",
                            ephemeral: true
                        });

                    }

                } catch {}
            }

            return;
        }

        // =========================
        // BUTTONS
        // =========================

        if (!interaction.isButton()) {
            return;
        }

        // Claim report
        if (
            interaction.customId === "claim_report"
        ) {
            return claimReport(
                interaction
            );
        }

        // Close report
        if (
            interaction.customId === "close_report"
        ) {
            return closeReport(
                interaction
            );
        }
    }
);

// =========================
// START BOT
// =========================

console.log(
    "🚀 Starting Sanctuary Assistant..."
);

console.log(
    "🔐 Token loaded:",
    process.env.DISCORD_TOKEN
        ? "YES"
        : "NO"
);

client.login(
    process.env.DISCORD_TOKEN
)
    .then(() => {
        console.log(
            "🔑 Login request sent to Discord."
        );
    })
    .catch(error => {
        console.error(
            "❌ Discord login failed:"
        );

        console.error(error);
    });