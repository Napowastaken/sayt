const package = require('../../../package.json');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require('discord.js');
const Command = require('../../utils/classes/Command');
module.exports = new Command({
    
    name: 'about',
    description: 'Information about... Me!',

    run(interaction, client) {
        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                label: 'Profile picture', style: ButtonStyle.Link, url: 'https://wolvesville.com'
            }), new ButtonBuilder({
                type: ComponentType.Button, label: 'Invite the bot!', style: ButtonStyle.Link,
                url: client.application.customInstallURL
            })
        );
        let embed = new EmbedBuilder()
        .setColor('Random')
        .setThumbnail(interaction.client.user.displayAvatarURL({ size: 512 }))
        .setDescription(`
> **General**
**Servers I'm in:** \`${client.guilds.cache.size}\`
**Users I'm helping:** \`${client.users.cache.filter(u => !u.bot).size}\`
**Command categories:** \`${client.categories.filter(c => c.name != 'dev').size}\`
**Total commands:** \`${client.commands.filter(c => c.category != 'dev').size}\`

> **Development**
**Developer:** ${client.application.owner}
**Language:** \`Javascript\`
**Library:** \`discord.js${package.dependencies['discord.js']}\`
**Dependencies:** \`${Object.keys(package.dependencies).length}\`

> **Connection**
**Bot's up since:** <t:${~~(client.readyTimestamp / 1000)}:R>
**Websocket ping:** \`${client.ws.ping}ms\`

> **Special thanks**
<@605923346051497987> <@356461130560045067> <@517729180054716416>
\`Testing and helping with the bot.\`
`);
        interaction.reply({ embeds: [embed], components: [row] });
    }
});