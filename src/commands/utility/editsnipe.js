const { EmbedBuilder } = require('discord.js');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'editsnipe',
    description: 'Snipe the latest edited message.',
    guildOnly: true,
    options: [{
        name: 'channel',
        description: 'Channel to edit snipe.',
        type: 'Channel',
        channelTypes: ['GuildText', 'GuildVoice', 'GuildNews',
        'GuildNewsThread', 'GuildPublicThread', 'GuildPrivateThread']
    }],
    
    run(interaction, client) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const snipe = client.editSnipes.get(channel.id);
        if (!snipe) return interaction.reply({
            content: `There aren't any edit snipable messages in ${channel}.`,
            ephemeral: true
        });

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setImage(snipe.attachment)
        .setDescription(`> **Edit snipe from ${channel}**

**Author:** \`${client.escTicks(snipe.author)}\`
**Old content**
${snipe.oldContent || 'None'}

**New content**
${snipe.content || 'None'}`);
        interaction.reply({ embeds: [embed] });
    }
});