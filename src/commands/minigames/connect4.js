const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Collection, Collector } = require('discord.js');
const Command = require('../../utils/classes/Command');

let gameComponents = [...Array(8).keys()].slice(1).map(c => new ButtonBuilder({
    label: `${c}`, customId: `connect4/game/${c}`, style: ButtonStyle.Primary
}));
const components = {
    invite: [new ActionRowBuilder().addComponents(
        new ButtonBuilder({
            label: 'Accept', style: ButtonStyle.Success, customId: 'connect4/invite/accept'
        }),
        new ButtonBuilder({
            label: 'Decline', style: ButtonStyle.Danger, customId: 'connect4/invite/decline'
        })
    )],
    game: [
        new ActionRowBuilder().addComponents(gameComponents.slice(0, 4)),
        new ActionRowBuilder().addComponents(gameComponents.slice(4, 7))
    ]
}

const values = {
    '': '⚫',
    'r': '🔴',
    'y': '🟡'
}

module.exports = new Command({

    name: 'connect4',
    description: 'Play a connect 4 game against someone else.',
    guildOnly: true,
    options: [{
        name: 'member',
        description: 'User to play against.',
        type: 'User',
        required: true,
        notClient: true,
        guildMember: true,
        notYourself: true
    }],

    async run(interaction, client) {
        let board = ['', '', '', '', '', '', ''].map(i => [i, i, i, i, i, i, i]).concat([[
            ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:'
        ]]);
        const user = interaction.options.getUser('member');
        if (user.bot) return interaction.reply({
            content: 'You trying to challenge a bot? Maybe try getting some real friends instead lmao',
            ephemeral: true
        });
        
        const turns = {
            r: user.id,
            y: interaction.user.id
        }
        let turn = 'r';

        interaction.reply({
            content: `${user}, you have been invited by **${client.escMD(interaction.user.tag)}** to play **connect 4**.
You have one minute to either accept or decline the invitation.`,
            components: components.invite,
            allowedMentions: { parse: ['users'] }
        });
        const reply = await interaction.fetchReply();
        let invite;
        try {
            invite = await reply.awaitMessageComponent({
                filter: i => i.user.id == user.id && i.customId.startsWith('connect4/invite/'),
                time: 60000
            });
        } catch {
            return interaction.editReply({
                content: `${user} didn't answer in time.`,
                components: [],
                allowedMentions: { parse: ['users'] }
            });
        }
        if (invite.customId.endsWith('/decline')) return invite.update({
            content: `**${client.escMD(user.tag)}** declined the invitation.`,
            components: []
        });

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(board.map(b => b.map(i => values[i] || i).join(' ')).join('\n'))
        .setFooter({ text: 'Note: Game will automatically end after 5 minutes of inactivity.' })
        .setTitle(`It's ${user.tag}'s turn! (${values.r})`);
        invite.update({
            content: null,
            embeds: [embed],
            components: components.game
        });

        let collecting = true;

        const collector = reply.createMessageComponentCollector({
            filter: i => [interaction.user.id, user.id].includes(i.user.id)
            && i.customId.startsWith('connect4/game/'),
            idle: 300000
        });
        collector.on('collect', i => {
            if (turns[turn] != i.user.id) return i.reply({
                content: 'Not your turn.',
                ephemeral: true
            });
            const position = Number(i.component.label) - 1;
            
            /** @type {string[]} */
            const line = board.filter(i => !i[position]).slice(-1)[0];
            line[position] = turn;
            if (board.every(i => i[position])) {
                i.message.components[position < 4 ? 0 : 1].components[position % 4].data.disabled = true;
            }

            embed.setDescription(board.map(b => b.map(i => values[i] || i).join(' ')).join('\n'));

            // Horizontal/vertical win check
            if (line.map(t => t || 'g').join('').includes(turn.repeat(4)) ||
            board.map(l => l[position] || 'g').join('').includes(turn.repeat(4))) {
                collecting = false;
                collector.stop(`**(${values[turn]}) ${client.escMD(turn == 'r' ? user.tag : interaction.user.tag)}** is the winner!`);
            }

            // Diagonal win check
            for (let num of [1, -1]) {
                board.forEach((line, rowIndex) => {
                    if (line.some((item, index) => {
                        if (!item) return;

                        return [1, -1].some(num2 => 
                        [item, board[rowIndex + num2]?.[index + num],
                        board[rowIndex + num2 * 2]?.[index + num * 2],
                        board[rowIndex + num2 * 3]?.[index + num * 3]]
                        .join('').includes(turn.repeat(4))
                        )
                    })) {
                        collecting = false;
                        return collector.stop(`**(${values[turn]}) ${client.escMD(turn == 'r' ? user.tag : interaction.user.tag)}** is the winner!`);
                    }
                });
            }

            if (!collecting) return;

            turn = (turn == 'r' ? 'y' : 'r');
            embed.setTitle(`It's ${turn == 'r' ? user.tag : interaction.user.tag}'s turn! (${values[turn]})`);
            i.update({ embeds: [embed], components: i.message.components });
            
        }).on('end', (collected, reason) => {
            let content = '';
            if (reason == 'idle') content = 'Game ended due to inactivity.';
            else content = reason;
            
            embed.setTitle(null);
            embed.setFooter(null);
            interaction.editReply({ content, embeds: [embed], components: [] });
        });
    }
});