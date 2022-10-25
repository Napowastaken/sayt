const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'infractions',
    description: 'Manage member infractions.',
    permissions: ['BanMembers', 'KickMembers', 'ModerateMembers'],
    guildOnly: true,
    options: [{
        name: 'remove',
        description: 'Remove the infraction with the given ID.',
        type: 'Subcommand',
        options: [{
            name: 'id',
            description: 'Infraction ID to remove.',
            type: 'Integer',
            minValue: 1,
            required: true
        }]
    },
    {
        name: 'info',
        description: 'Get information of an infraction.',
        type: 'Subcommand',
        options: [{
            name: 'id',
            description: 'Infraction ID to get information of.',
            type: 'Integer',
            minValue: 1,
            required: true
        }]
    },
    {
        name: 'list',
        description: 'List all infractions of a member.',
        type: 'Subcommand',
        options: [{
            name: 'member',
            description: 'Member to list infractions of.',
            type: 'User',
            required: true
        }]
    },
    {
        name: 'reason',
        description: 'Edit the reason of any infraction.',
        type: 'Subcommand',
        options: [{
            name: 'id',
            description: 'ID of the infraction to edit.',
            type: 'Integer',
            minValue: 1,
            required: true
        },
        {
            name: 'new_reason',
            description: 'The new reason.',
            type: 'String',
            required: true,
            maxLength: 440
        }]
    }],

    async run(interaction, client) {
        const id = interaction.options.getInteger('id');
        let infraction;
        if (id) infraction = client.infractions.get(id);
        if (id && (!infraction || infraction.guildId != interaction.guildId)) {
            return interaction.reply({
                content: `This infraction doesn't exist on this server.`,
                ephemeral: true
            });
        }

        let embed = new EmbedBuilder()
        .setColor('Random')

        switch(interaction.options.getSubcommand()) {
            case 'remove': {
                client.infractions.remove(id);
                interaction.reply(`Infraction \`#${id}\` has been removed from <@${infraction.userId}>.`);
            }

            case 'info': {
                embed.setTitle(`Infraction #${id}`)
                .addFields({ name: 'Member', value: `<@${infraction.userId}>`, inline: true },
                { name: 'Moderator', value: `<@${infraction.moderatorId}>`, inline: true },
                { name: 'Reason', value: `\`${client.escTicks(infraction.reason || 'No reason provided')}\``,
                inline: true },
                { name: 'Type', value: `\`${client.toCase(infraction.type)}\``, inline: true },
                { name: 'Time', value: `\`${infraction.stringDuration || 'None'}\``, inline: true },
                { name: 'Timestamp', value: `<t:${~~(infraction.timestamp / 1000)}>`});
                interaction.reply({ embeds: [embed] });
            } break;

            case 'list': {
                let page = 0;
                const user = interaction.options.getUser('member');
                const infractions = client.infractions.all(user.id, interaction.guildId).reverse().map(i => `
> **#${i.id}**
**Type:** \`${client.toCase(i.type)}\`
**Moderator:** \`${i.moderator.tag}\`${i.duration ? `\n**Time:** \`${i.stringDuration}\`` : ''}
\`\`\`${i.reason || 'No reason provided.'}\`\`\``);

                if (!infractions.length) return interaction.reply({
                    content: `**${client.escMD(user.tag)}** has no infractions here.`,
                    ephemeral: true
                });

                let row = new ActionRowBuilder().addComponents(new ButtonBuilder({
                    customId: 'infractions.list/prev', style: ButtonStyle.Secondary,
                    label: 'Previous', disabled: true
                }), new ButtonBuilder({
                    customId: 'infractions.list/next', style: ButtonStyle.Secondary,
                    label: 'Next', disabled: infractions.length < 6   
                }));

                embed.setTitle(`${user.tag}'s infractions`)
                .setDescription(infractions.slice(0, 5).join(''))
                .setFooter({ text: `Showing page 1/${Math.ceil(infractions.length / 5)}` })
                .setThumbnail(user.avatarURL({ size: 512, extension: 'png' }));

                interaction.reply({ embeds: [embed], components: [row] });
                if (infractions.length < 6) return;
                const reply = await interaction.fetchReply();

                reply.createMessageComponentCollector({
                    idle: 300000, componentType: ComponentType.Button,
                    filter: i => i.user.id == interaction.user.id && i.customId.startsWith('infractions.list/')
                }).on('collect', i => {

                    page += i.customId.endsWith('/next') ? 1 : -1;
                    reply.components[0].components[0].data.disabled = page < 1;
                    reply.components[0].components[1].data.disabled = page == Math.ceil(infractions.length / 5);

                    embed.setDescription(infractions.slice(page * 5, (page + 1) * 5).join(''))
                    .setFooter({ text: `Showing page ${page + 1}/${Math.ceil(infractions.length / 5)}` });
                    i.update({ embeds: [embed], components: [ActionRowBuilder.from(reply.components[0])] });

                }).once('end', () => interaction.editReply({ components: [] }));
            } break;

            case 'reason': {

                const reason = interaction.options.getString('new_reason');
                infraction.partial.reason = reason;
                client.infractions.set(`${infraction.id}`, infraction.partial);
                interaction.reply(`Infraction \`#${infraction.id}\` has been edited.
**New reason:** \`${client.escTicks(reason)}\``);

            } break;
        }
    }
});