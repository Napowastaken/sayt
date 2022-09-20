const { TextChannel } = require('discord.js');
const Command = require('../../utils/classes/Command');
const ms = require('../../utils/functions/ms');
module.exports = new Command({

    name: 'slowmode',
    description: 'Set the slowmode of a channel.',
    permissions: ['ManageChannels'],
    guildOnly: true,
    options: [{
        name: 'time',
        description: 'Time of the slowmode. Leave blank to remove.',
        type: 'String'
    },
    {
        name: 'channel',
        description: 'Channel where to set the slowmode.',
        type: 'Channel',
        clientPermissions: ['ManageChannels'],
        channelTypes: ['GuildText', 'GuildNews', 'GuildNewsThread',
        'GuildPublicThread', 'GuildPrivateThread']
    },
    {
        name: 'reason',
        description: 'Reason of the slowmode.',
        type: 'String',
        maxLength: 440
    }],

    run(interaction, client) {
        const time = ms(interaction.options.getString('time'));
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        if (time && (time.seconds < 1 || time.hours > 6)) return interaction.reply({
            content: 'Provide a valid time between 1 second (1s) and 6 hours. (6h)',
            ephemeral: true
        });
        channel.setRateLimitPerUser(time?.seconds || 0, `Set by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
        interaction.reply(`**Slowmode in ${channel} has been ${time ? `set to \`${time.long}\`` : 'removed.'}**`);
    }
});