/** @typedef {{ [id: string]: { votes: number, voting?: string} }} playerVotes */
const { 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    Collection,
    ButtonInteraction,
    SelectMenuBuilder
} = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'theisland',
    description: 'Forge alliances and vote out other people to be the last one standing.',

    async run(interaction, client) {
        const players = [interaction.user.id];
        let alive = [];
        let dead = [];
        let banned = [];
        let embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('The Island')
        .setDescription(`**${client.escMD(interaction.user.tag)}** created the lobby.`)
        .addFields({ name: 'List of players (1/10)', value: `${interaction.user} 👑` })
        .setFooter({ text: `If no players join during 15 minutes, the lobby will be closed.
Make sure to open DMs for the game to work as intended.` });

        let rows = [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder({
                    label: 'Join', style: ButtonStyle.Primary,
                    customId: `${this.name}/join`
                }),
                new ButtonBuilder({
                    label: 'Leave', style: ButtonStyle.Danger,
                    customId: `${this.name}/leave`
                })
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder({
                    label: 'Start game (4 players required)', style: ButtonStyle.Success,
                    customId: `${this.name}/start`, disabled: true
                })
            ),
            new ActionRowBuilder().addComponents(
                new ButtonBuilder({
                    label: 'Ban player', style: ButtonStyle.Primary,
                    customId: `${this.name}/ban`, emoji: '👢', disabled: true
                }),
                new ButtonBuilder({
                    label: 'Change host', style: ButtonStyle.Secondary,
                    customId: `${this.name}/changeHost`, emoji: '👑', disabled: true
                })
            )
        ]

        interaction.user.createDM();
        interaction.reply({ embeds: [embed], components: rows });
        const reply = await interaction.fetchReply();

        /** @type {{ collected: Collection<string, ButtonInteraction>, reason: string, interaction?: ButtonInteraction }} */
        const lobbyData = await new Promise(resolve => {
            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button, idle: 15 * 60000
            });

            collector.on('collect', async i => {
                let replied = false;
                const description = embed.data.description.split('\n').slice(-10).join('\n');
                if (i.customId.endsWith('/join')) {

                    if (players.includes(i.user.id)) return i.reply({
                        content: 'You are already in the lobby!',
                        ephemeral: true
                    });
                    if (banned.includes(i.user.id)) return i.reply({
                        content: 'You are banned from this lobby.',
                        ephemeral: true
                    });
                    i.user.createDM();
                    players.push(i.user.id);
                    embed.setDescription(`${description}\n**${i.user.tag}** joined.`);

                } else if (i.customId.endsWith('/leave')) {

                    if (!players.includes(i.user.id)) return i.reply({
                        content: 'You are not in the lobby.',
                        ephemeral: true
                    });
                    players.splice(players.indexOf(i.user.id), 1);
                    embed.setDescription(`${description}\n**${i.user.tag}** left.`);

                }
                if (!players.length) return collector.stop('allPlayersLeft');

                if (i.customId.endsWith('/start')) {
                    if (i.user.id != players[0]) return i.reply({
                        content: 'Only the host of the lobby can start the game.',
                        ephemeral: true
                    });
                    collector.stop('start');
                    rows = [];
                }

                if (i.customId.endsWith('/ban')) {
                    if (i.user.id != players[0]) return i.reply({
                        content: 'Only the host of the lobby can ban someone.',
                        ephemeral: true
                    });
                    let row = new ActionRowBuilder().addComponents(new SelectMenuBuilder({
                        customId: `${this.name}/ban/players`, placeholder: 'Select players to ban',
                        minValues: 1, maxValues: players.length - 1,
                        options: players.slice(1).map(p => ({
                            label: client.users.cache.get(p)?.tag, value: p
                        })),
                    }));
                    await i.reply({
                        content: 'Who would you like to ban?',
                        components: [row],
                        ephemeral: true
                    });
                    replied = true;
                    const reply2 = await i.fetchReply();
                    const bannedPlayers = await reply2.awaitMessageComponent({ 
                        time: 60000, componentType: ComponentType.StringSelect
                    });
                    bannedPlayers.values.forEach(p => {
                        players.splice(players.indexOf(p), 1);
                        banned.push(p);
                        embed.setDescription(`${description}\n**${client.users.cache.get(p)?.tag}** was banned by **${i.user.tag}**.`);
                    });
                    await i.deleteReply();
                }

                if (i.customId.endsWith('/changeHost')) {
                    if (i.user.id != players[0]) return i.reply({
                        content: 'Only the host of the lobby can change the host.',
                        ephemeral: true
                    });
                    let row = new ActionRowBuilder().addComponents(new SelectMenuBuilder({
                        customId: `${this.name}/changeHost/player`,
                        placeholder: 'Select the new host',
                        options: players.slice(1).map(p => ({
                            label: client.users.cache.get(p)?.tag, value: p
                        })),
                    }));
                    await i.reply({
                        content: 'Who would you like to be the new host?',
                        components: [row],
                        ephemeral: true
                    });
                    replied = true;
                    const reply2 = await i.fetchReply();
                    const host = await reply2.awaitMessageComponent({ 
                        time: 60000, componentType: ComponentType.StringSelect
                    });
                    players.splice(players.indexOf(host.values[0]), 1);
                    players[0] = host.values[0];
                    players.push(i.user.id);
                    embed.setDescription(`${description}\n**${client.users.cache.get(host.values[0]).tag}** is the new host.`);
                    await i.deleteReply();
                }

                rows[0]?.components[0].setDisabled(players.length == 10);
                rows[1]?.components[0].setDisabled(players.length < 4);
                rows[2]?.components[0].setDisabled(players.length == 1);
                rows[2]?.components[1].setDisabled(players.length == 1);
                embed.setFields({ 
                    name: `List of players (${players.length}/10)`,
                    value: `<@${players[0]}> 👑\n${players.slice(1).map(p => `<@${p}>`).join('\n')}`
                });
                if (!replied) await i.update({ embeds: [embed], components: rows });
                else await interaction.editReply({ embeds: [embed], components: rows });
            }).on('end', (collected, reason) => resolve({ collected, reason, interaction: collected.last() }));
        });
        switch(lobbyData.reason) {
            case 'idle': {
                return interaction.editReply({ content: 'Lobby closed due to inactivity.', components: [] });
            } break;
            
            case 'allPlayersLeft': {
                return interaction.editReply({ content: 'All players left the lobby.', components: [] });
            } break;
        }

        reply.reply({
            content: `${players.map(p => `<@${p}>`).join(' ')}, Game will start in **15 seconds!**`,
            allowedMentions: { parse: ['users'] }
        });
        alive = [...players];
        await client.sleep(15000);
        
        while (alive.length > 2) {
            embed.setTitle('Discussion phase begins!')
            .setDescription(`Start creating alliances and discuss who will be killed this day.
You should DM people you want to team up with.
    **Discussion phase ends <t:${~~((Date.now() + (15000 * alive.length)) / 1000)}:R>.**`)
            .setFooter(null)
            .setFields(
                { name: 'Alive', value: alive.map(p => `<@${p}>`).join('\n') },
                { name: 'Dead', value: (dead.map(p => `<@${p}>`).join('\n') || 'None') }
            );

            reply.edit({ embeds: [embed] });
            await client.sleep(alive.length * 15000);

            embed.setTitle('Voting phase begins!')
            .setDescription(`Choose who will die today. In case of a tie, a random player with the highest votes will die.
**Voting ends <t:${~~((Date.now() + 30000) / 1000)}:R>**`)
            .setFields({
                name: 'Votes', value: `${alive.map(p => `[] **${client.escMD(client.users.cache.get(p).tag)}** (0 votes)`).join('\n')}`
            })
            let row = new ActionRowBuilder().addComponents(new SelectMenuBuilder({
                customId: `${this.name}/vote`, placeholder: 'Choose who to vote',
                options: alive.map(p => ({
                    label: client.users.cache.get(p).tag,
                    value: `${p}|${client.users.cache.get(p).tag}`
                }))
            }));
            /** @type {playerVotes}  */
            let votes = alive.reduce((prev, player) => ({ 
                ...prev, [player]: { votes: 0, voting: null }
            }), {});

            reply.reply('Voting phase has begun!')
            reply.edit({ embeds: [embed], components: [row] });
            const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.SelectMenu, filter: i => alive.includes(i.user.id),
                time: 30000
            });
         
            collector.on('collect', i => {
                const id = i.values[0].split('|')[0];
                const tag = i.values[0].split('|')[1];
                const { voting } = votes[i.user.id];
                if (voting) {
                    votes[client.users.cache.find(u => u.tag == voting).id].votes -= 1;
                }
                votes[i.user.id].voting = (voting != tag) ? tag : null;
                votes[id].votes += votes[i.user.id].voting ? 1 : 0;
                embed.setFields({
                    name: 'Votes',
                    value: alive.map(p => 
                        `[${votes[p].voting || ''}] **${client.escMD(client.users.cache.get(p).tag)}** (${votes[p].votes} vote${(votes[p].votes != 1) ? 's' : ''})`
                    ).join('\n')
                });
                i.update({ embeds: [embed] });
            });
            await client.sleep(30000);

            /** @type {string} */
            let voted = Object.keys(votes).sort((a, b) => votes[b].votes - votes[a].votes)
            voted = voted.filter(p => votes[p].votes == votes[voted[0]].votes)
            voted = voted[~~(Math.random() * voted.length)];

            reply.edit({ components: [] });
            alive.splice(alive.indexOf(voted), 1);
            dead.push(voted);
            reply.reply(`Unfortunately, **${client.escMD(client.users.cache.get(voted).tag)}** has been eliminated.`);

            await client.sleep(5000);
        }

        embed.setDescription('**It is time for the DEAD to vote who to kill.**')
        .setFooter({ text: 'Everyone you betrayed doesn\'t want you alive.' })
        .setTitle(null)
        .setFields();
        let row = new ActionRowBuilder()
        alive.forEach(p => row.addComponents(new ButtonBuilder({
            label: `${client.users.cache.get(p).tag} (0)`, customId: `${this.name}/vote/dead/${p}/${client.users.cache.get(p).tag}`,
            style: ButtonStyle.Secondary
        })));
        reply.reply('DEAD people will vote now!');
        reply.edit({ embeds: [embed], components: [row] });
        const collector = reply.createMessageComponentCollector({
            time: 30000, filter: i => dead.includes(i.user.id),
            componentType: ComponentType.Button
        });

        /** @type {playerVotes} */
        let votes = players.reduce((prev, p) => ({
            ...prev, [p]: { votes: 0, voting: null }
        }), {});
        collector.on('collect', i => {
            const id = i.customId.split('/').at(-2);
            const tag = i.customId.split('/').at(-1);
            const { voting } = votes[i.user.id];
            if (voting) {
                votes[client.users.cache.find(u => u.tag == votes[i.user.id].voting).id].votes -= 1;
            }
            votes[i.user.id].voting = (voting != tag) ? tag : null;
            votes[id].votes += votes[i.user.id].voting ? 1 : 0;

            row.components.find(c => c.data.custom_id.split('/').at(-2) == id)
            .setLabel(`${client.users.cache.get(id).tag} (${votes[id].votes})`);
            i.update({ components: [row] });
        }).on('end', () => {
            const winner = Object.keys(votes).filter(p => alive.includes(p))
            .sort((a, b) => votes[a].votes - votes[b].votes)[0];

            embed.setDescription(`**${client.escMD(client.users.cache.get(winner).tag)}** is THE WINNER!`)
            .setFooter(null);
            reply.edit({ embeds: [embed], components: [] });
            reply.reply(`**${client.escMD(client.users.cache.get(winner).tag)}** is THE WINNER!`);
        });
    }
});