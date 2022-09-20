const Event = require("../utils/classes/Event");

module.exports = new Event({
    name: 'messageCreate',
    run(client, message) {
        if (message.author.bot || !new RegExp(`^<@!?${client.user.id}>$`).test(message.content)) return;
        let content = `**Hey!** You can view all my commands by simply typing \`/\`, or by </commands:${client.application.commands.cache.find(c => c.name == 'commands').id}>.`;

        if (message.guild.members.me.permissionsIn(message.channel).has('SendMessages')) {
            message.reply(content);
        }
        else message.author.send(content).catch(() => {});
    }
})