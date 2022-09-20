const { EmbedBuilder, parseEmoji } = require("discord.js");
const MessageContextMenuCommand = require("../../utils/classes/MessageContextMenuCommand");

module.exports = new MessageContextMenuCommand({
    name: 'Find custom emojis',
    withContent: true,
    run(interaction, client) {
        const static = interaction.targetMessage.content.match(/<:\w{2,32}:\d{17,19}>/g);
        const animated = interaction.targetMessage.content.match(/<a:\w{2,32}:\d{17,19}>/g);
        console.log(animated)
        if (!static && !animated) return interaction.reply({
            content: 'Could not find any emojis in that message.',
            ephemeral: true
        });

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(
`> **Static**
${static?.map(e => {
    let emoji = parseEmoji(e);
    return `${e} \`${e}\` **[Link](https://cdn.discordapp.com/emojis/${emoji.id}.png?size=512)**`
}) || `No emojis.`}

> **Animated**
${animated?.map(e => {
    let emoji = parseEmoji(e);
    return `${e} \`${e}\` **[Link](https://cdn.discordapp.com/emojis/${emoji.id}.gif?size=512)**`
}) || '`No emojis.`'}`);
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
})