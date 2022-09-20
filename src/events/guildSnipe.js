const { AuditLogEvent } = require("discord.js");
const Event = require("../utils/classes/Event");
const GuildSnipe = require("../utils/classes/GuildSnipe");
module.exports = new Event({
    name: 'messageDelete',
    
    async run(client, message) {
        if (!message.content && !message.attachments.size) return;
        client.snipes.set(message.channel.id, new GuildSnipe({
            author: message.author.tag,
            content: message.content,
            attachment: message.attachments.first()?.url
        }));
    }
});