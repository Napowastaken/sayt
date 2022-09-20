const Command = require("../../utils/classes/Command");
const { Message, Collection } = require('discord.js');
module.exports = new Command({

    name: 'clean',
    description: 'Clean messages.',
    permissions: ['ManageMessages'],
    guildOnly: true,
    options: [{
        name: 'channel',
        description: 'Clean some messages from a channel.',
        type: 'Subcommand',
        options: [{
            name: 'number',
            description: 'Number of messages to clean.',
            type: 'Integer',
            minValue: 1,
            maxValue: 100,
            required: true
        },
        {
            name: 'channel',
            description: 'Channel to clean. Defaults to this channel.',
            type: 'Channel',
            clientPermissions: ['ViewChannel', 'ReadMessageHistory', 'ManageMessages'],
            channelTypes: ['GuildText', 'GuildVoice', 'GuildNews',
            'GuildNewsThread', 'GuildPublicThread', 'GuildPrivateThread']
        }]
    },
    {
        name: 'user',
        type: 'Subcommand',
        description: 'Clean some messages from a member.',
        options: [{
            name: 'user',
            description: 'User of messages to clean.',
            type: 'User',
            required: true
        },
        {
            name: 'number',
            description: 'Number of messages to clean.',
            type: 'Integer',
            minValue: 2,
            maxValue: 100,
            required: true
        },
        {
            name: 'channel',
            description: 'Channel to clean. Defaults to this channel.',
            type: 'Channel',
            clientPermissions: ['ViewChannel', 'ReadMessageHistory', 'ManageMessages'],
            channelTypes: ['GuildText', 'GuildVoice', 'GuildNews',
            'GuildNewsThread', 'GuildPublicThread', 'GuildPrivateThread']
        }]
    },
    {
        name: 'includes',
        type: 'Subcommand',
        description: 'Clean all messages that include a specific input.',
        options: [{
            name: 'content',
            description: 'The content to delete.',
            type: 'String',
            required: true
        },
        {
            name: 'number',
            description: 'Number of messages to clean.',
            type: 'Integer',
            minValue: 2,
            maxValue: 100,
            required: true
        },
        {
            name: 'channel',
            description: 'Channel to clean. Defaults to this channel.',
            type: 'Channel',
            clientPermissions: ['ViewChannel', 'ReadMessageHistory', 'ManageMessages'],
            channelTypes: ['GuildText', 'GuildVoice', 'GuildNews',
            'GuildNewsThread', 'GuildPublicThread', 'GuildPrivateThread']
        }]
    }],

    async run(interaction, client) {
        await interaction.deferReply();
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const number = interaction.options.getInteger('number');
        if (channel.messages.cache.size < 100) {
            await channel.messages.fetch({ limit: 100, cache: true });
        }
        channel.messages.cache = channel.messages.cache.sort((a, b) => a.id - b.id);

        /** @type {Collection<string, Message>} */
        let messages;
        switch(interaction.options.getSubcommand()) {
            
            case 'channel': {
                messages = channel.messages.cache.filter(m => m.id != channel.messages.cache.lastKey());
            } break;

            case 'user': {
                const user = interaction.options.getUser('user');
                messages = channel.messages.cache.filter(m => m.author.id == user.id);
                if (user.id == client.user.id) {
                    messages = messages.filter(m => m.id != messages.lastKey()); 
                }
            } break;

            case 'includes': {
                const content = interaction.options.getString('content').toLowerCase();
                messages = channel.messages.cache.filter(m => m.content.toLowerCase().includes(content));
            } break;

        }
        messages = await channel.bulkDelete(messages.filter(m => m.createdTimestamp + 1209600000 > Date.now())
        .lastKey(number));
        await interaction.followUp(`**Deleted ${messages.size} message${number != 1 ? 's' : ''} in ${channel}.**`);
    }
});