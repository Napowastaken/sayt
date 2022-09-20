const { EmbedBuilder } = require('discord.js');
const ms = require('../../utils/functions/ms');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'serverinfo',
    description: 'Get information about this server.',
    permissions: ['ManageGuild'],
    guildOnly: true,

    run(interaction, client) {
        const guild = interaction.guild;
        let embed = new EmbedBuilder()
        .setColor('Random')
        .setImage(guild.bannerURL({ size: 512, extension: 'png' }))
        .setThumbnail(guild.iconURL({ size: 512, extension: 'png' }))
        .setDescription(`> **General**
**Name:** \`${client.escTicks(guild.name)}\`
**ID:** \`${guild.id}\`
**Description:** \`${client.escTicks(guild.description || 'None')}\`
**Created at:** <t:${~~(guild.createdTimestamp / 1000)}>
**Owner:** <@${guild.ownerId}>

> **Moderation**
**Explicit content filter:** \`${client.names.explicitFilters[guild.explicitContentFilter]}\`
**2FA moderation:** \`${guild.mfaLevel == 'ELEVATED' ? 'Enabled' : 'Disabled'}\`
**Verification level:** \`${client.names.verificationLevels[guild.verificationLevel]}\`

> **Other**
**Community:** \`${guild.features.includes('COMMUNITY') ? 'Yes' : 'No'}\`
**Partnered:** \`${guild.partnered ? 'Yes' : 'No'}\`
**Verified:** \`${guild.verified ? 'Yes' : 'No'}\`
**Members:** \`${guild.memberCount}\`
**Default message notifications:** \`${guild.defaultMessageNotifications ? 'Only mentions' : 'All messages'}\`
**Boosts:** \`${guild.premiumSubscriptionCount}\`

> **Channels**
**System messages:** ${guild.systemChannelId ? `<#${guild.systemChannelId}>` : '`None`'}
**Rules:** ${guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : '`None`'}
**Public updates:** ${guild.publicUpdatesChannelId ? `<#${guild.publicUpdatesChannelId}>` : '`None`'}
**AFK channel:** ${guild.afkChannelId ? `<#${guild.afkChannelId}> \`(${ms(guild.afkTimeout * 1000)?.long})\`` : '`None`'}`);
        interaction.reply({ embeds: [embed] });
    }
});