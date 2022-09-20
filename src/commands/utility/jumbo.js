const Command = require("../../utils/classes/Command");
const { EmbedBuilder, parseEmoji } = require('discord.js');
const fetch = require('node-fetch');
module.exports = new Command({

    name: 'jumbo',
    description: 'Show a bigger image of any emoji.',
    options: [{
        name: 'emoji',
        description: 'Emoji to jumbo.',
        type: 'String',
        required: true
    }],

    async run(interaction, client) {
        const emoji = interaction.options.getString('emoji');
        let defaultMatch = emoji.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
        let url;
        if (/<a?:\w{2,32}:\d{17,20}>/.test(emoji)) {
            const emote = parseEmoji(emoji);
            url = `https://cdn.discordapp.com/emojis/${emote.id}.${emote.animated ? 'gif' : 'png'}?size=512`;
        }
        else if (defaultMatch) {
            const codePoints = defaultMatch.map(m => m.codePointAt(0).toString(16)).join('-');
            const req = await fetch(`https://cdn.notsobot.com/twemoji/512x512/${codePoints}.png`);
            
            if (req.status == 404) return interaction.reply({
                content: 'An invaid emoji was provided.',
                ephemeral: true
            });
            url = req.url;
        }
        else return interaction.reply({
            content: 'An invalid emoji was provided.',
            ephemeral: true
        });

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`> **Jumbo** of ${emoji}`)
        .setImage(url);
        interaction.reply({ embeds: [embed] });
    }
});