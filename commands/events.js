function showEvents(message) {
    return message.reply(
        "📅 **Sanctuary Events**\n\n" +
        "There are currently no upcoming events.\n\n" +
        "Check back later for future clan events!"
    );
}

module.exports = {
    showEvents
};