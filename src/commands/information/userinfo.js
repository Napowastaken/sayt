const { EmbedBuilder, ActivityType } = require('discord.js');
const fetch = require('node-fetch');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'userinfo',
    description: 'Get information about an user.',
    permissions: ['ManageGuild'],
    options: [{
        name: 'user',
        description: 'User to get information of. Defaults to you.',
        type: 'User'
    }],

    async run(interaction, client) {
        const member = interaction.options.getMember('user') || interaction.options.getUser('user') || interaction.member || interaction.user;
        const fetchedUser = await fetch(`https://discord.com/api/v9/users/${member.id}`, {
            headers: { Authorization: `Bot ${client.token}` }
        }).then(d => d.json());

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setImage(`https://cdn.discordapp.com/banners/${member.id}/${fetchedUser.banner}.${fetchedUser.banner?.startsWith('a_') ? 'gif' : 'png'}?size=512`);

        if (member.user) {

            const status = member.presence?.activities?.find(a => a.type == ActivityType.Custom);
            embed.setThumbnail(member.displayAvatarURL({ size: 512, extension: 'png' }))
            .setDescription(`> **General**
**Name:** \`${client.escTicks(member.user.username)}\`
**Discriminator:** \`#${member.user.discriminator}\`
**ID:** \`${member.id}\`
**Flags:** \`${member.user.flags.toArray().map(f => client.names.userFlags[f]).join(', ') || 'None'}.\`
**Created at:** <t:${~~(member.user.createdTimestamp / 1000)}>
**Bot:** \`${member.user.bot ? 'Yes' : 'No'}\`
**Banner color:** \`${fetchedUser.banner_color?.toLowerCase() || 'None'}\`

> **Guild**
**Nickname:** \`${client.escTicks(member.nickname || 'None')}\`
**Joined at:** <t:${~~(member.joinedTimestamp / 1000)}>
**Boosting since:** ${member.premiumSince ? `<t:${member.premiumSinceTimestamp}>` : '`Not boosting.`'}
**Highest role:** ${member.roles.highest}
**Total roles:** \`${member._roles.length}\`
**Infractions:** \`${client.infractions.all(member.id, interaction.guild.id).length}\`

> **Presence**
**Status:** ${client.emotes[member.presence?.status || 'offline']} \`${client.names.statuses[`${member.presence?.status || 'offline'}`]}\`
**Custom status:** ${status ? (`${status.emoji || ''} ${status.state ? `\`${client.escTicks(status.state)}\`` : ''}`) : '`None`'}

> **Activities**
${member.presence?.activities?.filter(a => a.type != ActivityType.Custom).map(a =>
`\`${ActivityType[`${a.type}`]} ${client.escTicks(a.name)}\`
<t:${~~(new Date(a.timestamps.start).getTime() / 1000)}:R>${a.details ? `\n\`${client.escTicks(a.details)}\`` : ''}
${a.state ? `\`${client.escTicks(a.state)}\`` : ''}`).join('\n\n') || '`None`'}`);
        // <Activity>.createdTimestamp returns NaN

        } else {

            embed.setThumbnail(member.avatarURL({ size: 512, extension: 'png' }))
            .setDescription(`> **General**
**Name:** \`${client.escTicks(member.username)}\`
**Discriminator:** \`#${member.discriminator}\`
**ID:** \`${member.id}\`
**Badges:** \`${member.flags.toArray().map(f => client.names.userFlags[f]).join(', ') || 'None'}.\`
**Created at:** <t:${~~(member.createdTimestamp / 1000)}>
**Bot:** \`${member.bot ? 'Yes' : 'No'}\`
**Banner color:** \`${fetchedUser.banner_color?.toLowerCase() || 'None'}\`

${interaction.guild ? `> **Guild**
**Infractions:** \`${client.infractions.all(member.id, interaction.guildId).length}\``
: ''}`);
        }
        interaction.reply({ embeds: [embed] });
    }
});