const Event = require("../utils/classes/Event");
module.exports = new Event({
    name: 'messageCreate',
    run(client, message) {
        const status = client.afks.get(message.author.id);
        const mentions = message.mentions.users.filter(m => 
            client.afks.has(m.id) && (client.afks.get(m.id).global || client.afks.get(m.id).guild == message.guildId
        ));
        if (status) {
            if (status.global || status.guild == message.guildId) {
                client.afks.delete(message.author.id);

                if (message.guild.members.me.permissionsIn(message.channel).has('AddReactions')) {
                    message.react('👋');
                }
                else if (message.guild.members.me.permissionsIn(message.channel).has('SendMessages')) {
                    message.channel.send(`**Welcome back!** Your AFK status has been **removed.**`);
                }
            }
        }
        if (!mentions.size) return;
        const content = mentions.map(m => `**${client.escMD(m.tag)}** is AFK for \`${client.afks.get(m.id).reason}\``);

        if (message.guild.members.me.permissions.has('SendMessages')) message.reply(content.join('\n'));
        else return message.author.send(content.join('\n')).catch(() => {})
    }
});