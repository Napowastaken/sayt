const Event = require("../utils/classes/Event");

module.exports = new Event({
    name: 'messageUpdate',
    run(client, oldMessage, message) {
        if (oldMessage.editedTimestamp == message.editedTimestamp) return;
        if (!oldMessage.content && !message.content) return;

        client.editSnipes.set(message.channelId, {
            oldContent: oldMessage.content,
            content: message.content,
            author: message.author.tag,
            attachment: oldMessage.attachments.first()?.url
        });
    }
})