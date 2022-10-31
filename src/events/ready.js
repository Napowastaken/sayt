const { ActivityType } = require("discord.js");
const Event = require("../utils/classes/Event");
module.exports = new Event({
    name: 'ready',
    
    run(client) {
        client.user.setPresence({
            activities: [{
                name: `/commands - ${client.guilds.cache.size} servers`,
                type: ActivityType.Playing
            }]
        });
    }
});