const { EmbedBuilder } = require('discord.js');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'snipe',
    description: 'Snipe the latest deleted message.',
    guildOnly: true,
    options: [{
        name: 'channel',
        description: 'Channel to snipe.',
        type: 'Channel',
        channelTypes: ['GuildText', 'GuildVoice', 'GuildNews',
        'GuildNewsThread', 'GuildPublicThread', 'GuildPrivateThread']
    }],
    
    run(interaction, client) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const snipe = client.snipes.get(channel.id);
        if (!snipe) return interaction.reply({
            content: `There aren't any snipable messages in ${channel}.`,
            ephemeral: true
        });

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setImage(snipe.attachment)
        .setDescription(`> **Snipe from ${channel}**

**Author:** \`${client.escTicks(snipe.author)}\`
**Content**
${snipe.content || 'None'}`);
        interaction.reply({ 
            content: snipe.reference && `**In reply to [this message](${snipe.reference.url})**`,
            embeds: [embed]
        });
    }
});