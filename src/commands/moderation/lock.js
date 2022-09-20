const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'lock',
    description: 'Lock a channel, denying many permissions for @everyone role.',
    permissions: ['ManageRoles'],
    guildOnly: true,
    options: [{
        name: 'channel',
        description: 'Channel to lock. Defaults to your current channel.',
        type: 'Channel',
        clientPermissions: ['ManageRoles'],
        channelTypes: ['GuildText', 'GuildVoice', 'GuildCategory', 'GuildNews']
    },
    {
        name: 'reason',
        description: 'Reason of the lockdown.',
        type: 'String',
        maxLength: 430
    }],

    async run(interaction, client) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        const perms = {
            text: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'AddReactions',
            'CreatePublicThreads', 'CreatePrivateThreads', 'SendMessagesInThreads',
            'AttachFiles', 'EmbedLinks'],
            voice: ['ViewChannel', 'ReadMessageHistory', 'SendMessages', 'Connect', 'Speak',
            'AddReactions']
        }
        
        const row = new ActionRowBuilder().addComponents(
            new SelectMenuBuilder({
                minValues: 1, maxValues: channel.isVoiceBased() ? 6 : 9, customId: 'lock/permissions',
                options: (channel.isVoiceBased() ? perms.voice : perms.text).map(p => ({
                    label: client.names.permissions[p],
                    value: p
                }))
            })
        );

        await interaction.reply({
            content: 'What permissions would you like to remove?',
            components: [row]
        });
        const reply = await interaction.fetchReply();

        let permissions;
        try { permissions = await reply.awaitMessageComponent({ 
                time: 60000, filter: i => i.user.id == interaction.user.id
            });
        }
        catch { return interaction.deleteReply() }

        await channel.permissionOverwrites.edit(interaction.guildId, permissions.values.reduce((p, c) => ({
            ...p, [c]: false
        }), {}), { reason: `Locked by ${interaction.user.tag} (${interaction.user.id}) | ${reason}` });
        
        await permissions.update({ 
            content: `**Locked ${channel}.**\n\`\`\`${client.escTicks(reason)}\`\`\``,
            components: []
        });
    }
});