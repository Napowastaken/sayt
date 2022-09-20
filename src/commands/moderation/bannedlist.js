const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'bannedlist',
    description: 'Show a list of banned members in this server.',
    permissions: ['BanMembers'],
    clientPermissions: ['BanMembers'],

    async run(interaction, client) {
        const bans = await interaction.guild.bans.fetch();
        if (!bans.size) return interaction.reply({
            content: 'This server has no banned members.',
            ephemeral: true
        });

        const list = bans.map(b =>
`**${b.user.tag} (${b.user.id})**
\`\`\`${b.reason || 'No reason provided.'}\`\`\`(Account created at <t:${~~(b.user.createdTimestamp / 1000)}>)`
        );
        let page = 0;
        let row = new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                label: 'Previous', customId: 'bannedlist/prev',
                style: ButtonStyle.Secondary, disabled: true
            }),
            new ButtonBuilder({
                label: 'Next', customId: 'bannedlist/next',
                style: ButtonStyle.Secondary, disabled: list.length < 6
            })
        );

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(`Banned members from ${interaction.guild.name}`)
        .setThumbnail(interaction.guild.iconURL({ size: 512, extension: 'png' }))
        .setDescription(list.slice(0, 5).join('\n\n\n'))
        .setFooter({ text: `Showing page 1/${Math.ceil(list.length / 5)}`});

        const reply = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        reply.createMessageComponentCollector({
            idle: 300 * 1000,
            filter: i => i.user.id == interaction.user.id && i.customId.startsWith('bannedlist/')
        }).on('collect', i => {

            page += i.customId.endsWith('/next') ? 1 : -1;
            reply.components[0].components[0].data.disabled = page == 0;
            reply.components[0].components[1].data.disabled = page == Math.ceil(list.length / 5) - 1;

            embed.setDescription(list.slice(page * 5, (page + 1) * 5).join('\n\n\n'))
            .setFooter({ text: `Showing page ${page + 1}/${Math.ceil(list.length / 5)}`})
            i.update({ embeds: [embed], components: [ActionRowBuilder.from(reply.components[0])] });

        }).on('end', () => interaction.editReply({ components: [] }));
    }
});