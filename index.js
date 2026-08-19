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
    addEvent,
    getEvents
} = require("./commands/addevent");

const {
    deleteEvent
} = require("./commands/deleteevent");

// =========================
// ENVIRONMENT VARIABLES
// =========================

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

// =========================
// CLIENT
// =========================

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
        ),

    // /deleteevent
    new SlashCommandBuilder()
        .setName("deleteevent")
        .setDescription(
            "Delete an existing Sanctuary event"
        )
        .addStringOption(option =>
            option
                .setName("event")
                .setDescription(
                    "Select the event you want to delete"
                )
                .setRequired(true)
                .setAutocomplete(true)
        )
        .setDefaultMemberPermissions("8")

].map(command => command.toJSON());

// =========================
// REGISTER COMMANDS
// =========================

async function registerCommands() {
    try {

        if (!process.env.DISCORD_TOKEN) {
            console.error(
                "❌ DISCORD_TOKEN is missing!"
            );
            return;
        }

        if (!CLIENT_ID) {
            console.error(
                "❌ DISCORD_CLIENT_ID is missing!"
            );
            return;
        }

        if (!GUILD_ID) {
            console.error(
                "❌ DISCORD_GUILD_ID is missing!"
            );
            return;
        }

        const rest = new REST({
            version: "10"
        }).setToken(
            process.env.DISCORD_TOKEN
        );

        console.log(
            "🔄 Registering slash commands..."
        );

        console.log(
            `📡 Guild ID: ${GUILD_ID}`
        );

        console.log(
            `🤖 Client ID: ${CLIENT_ID}`
        );

        console.log(
            `📋 Commands to register: ${commands.length}`
        );

        await rest.put(
            Routes.applicationGuildCommands(
                CLIENT_ID,
                GUILD_ID
            ),
            {
                body: commands
            }
        );

        console.log(
            `✅ ${commands.length} slash commands registered successfully!`
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
        // AUTOCOMPLETE
        // =========================

        if (interaction.isAutocomplete()) {

            if (
                interaction.commandName === "deleteevent"
            ) {

                try {

                    const events = getEvents();

                    const search =
                        interaction.options
                            .getString("event")
                            ?.toLowerCase() || "";

                    const filteredEvents =
                        events
                            .filter(event =>
                                event.name
                                    .toLowerCase()
                                    .includes(search)
                            )
                            .slice(0, 25);

                    await interaction.respond(
                        filteredEvents.map(event => ({
                            name:
                                `${event.name} — ${event.date} ${event.time}`
                                    .slice(0, 100),

                            value: String(event.id)
                        }))
                    );

                } catch (error) {

                    console.error(
                        "❌ Event autocomplete error:",
                        error
                    );

                    await interaction.respond([]);

                }

                return;
            }

            return;
        }

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
                        "`/addevent` — Create a new event\n" +
                        "`/deleteevent` — Delete an existing event"
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

                // /deleteevent
                if (
                    interaction.commandName === "deleteevent"
                ) {
                    return deleteEvent(
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

console.log(
    "🆔 Client ID loaded:",
    CLIENT_ID
        ? "YES"
        : "NO"
);

console.log(
    "🏠 Guild ID loaded:",
    GUILD_ID
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