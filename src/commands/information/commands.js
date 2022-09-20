const { EmbedBuilder } = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'commands',
    description: 'Show commands from the bot.',

    run(interaction, client) {
        let embed1 = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Chat input (slash) commands')
        .setDescription(client.categories.filter(c => c.name != 'dev' && !c.name.startsWith('context.')).map(category =>
        `> **${client.toCase(category.name)}**
${category.commands.map(command => `</${command}:${client.application.commands.cache.find(c => c.name == command).id}>`).join(' ')}`
        ).join('\n\n'))
        .setFooter({ text: 'Click a command or type it out in chat for more information about it.' });

        let embed2 = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Context menu commands`)
        .setDescription(client.categories.filter(c => c.name.startsWith('context.') && c.commands[0]).map(c =>
`> **${client.toCase(c.name.split('.')[1])}**
${c.commands.map(c => `\`${c}\``).join(' \u200b'.repeat(4))}`).join('\n\n'))
        .setFooter({ text: 'Right click an user or a message, then head to Apps and find the command you want to use.' });

        interaction.reply({ embeds: [embed1, embed2] });
    }
});