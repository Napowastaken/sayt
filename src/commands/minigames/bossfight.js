const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const Command = require("../../utils/classes/Command");

module.exports = new Command({

    name: 'bossfight',
    description: 'Play a boss fight against me.',
    options: [{
        name: 'boss_health',
        description: 'Health of the boss. Defaults to 50.',
        type: 'Integer',
        minValue: 10,
        maxValue: 500
    },
    {
        name: 'your_health',
        description: 'Your own health. Defaults to 20.',
        type: 'Integer',
        minValue: 1,
        maxValue: 100
    }],

    async run(interaction, client) {
        let hp = {
            boss: interaction.options.getInteger('boss_health') || 50,
            user: interaction.options.getInteger('your_health') || 20,
        }
        let maxHP = {
            boss: hp.boss,
            user: hp.user
        }
        let _super = 0;

        let howToPlayRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                style: ButtonStyle.Success, customId: 'bossfight/howtoplay', label: 'Alright',
            })
        )

        let rows = [new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                style: ButtonStyle.Danger, label: 'Attack', customId: 'bossfight/attack',
            }),
            new ButtonBuilder({
                style: ButtonStyle.Primary, label: 'Defend', customId: 'bossfight/defend'
            }),
            new ButtonBuilder({
                style: ButtonStyle.Success, label: 'Heal',
                customId: 'bossfight/heal', disabled: true
            })
        ), new ActionRowBuilder().addComponents(
            new ButtonBuilder({
                style: ButtonStyle.Secondary, label: 'SUPER',
                customId: 'bossfight/super', disabled: true
            })
        )];

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(
`> **How to play**
\`You will fight against a boss with three options you can use to win.\`
**Attack:** \`Try to deal some damage to the boss.\`
**Defend:** \`A chance that you are immune to their next attack.\`
**Heal:** \`Heal some health points. Keep in mind you can't exceed your max health.\`

> **Super**
**When you attack:** \`You charge your super as many damage points you dealt.\`
**When you defend:** \`It charges 50% of the damage blocked.\`
**When you heal:** \`It charges as many HP you recovered.\`
**When you recieve damage:** \`You lose as many damage points the boss dealt.\`

**When you use super:** \`Super is a mix of the 3 abilities at once.
You get a shield for this turn, deal guaranteed damage of 10-15 points and heal 50% of damage dealt.\``);
        
        interaction.reply({ embeds: [embed], components: [howToPlayRow] });
        const reply = await interaction.fetchReply();

        try {
            await reply.awaitMessageComponent({
                filter: i => i.user.id == interaction.user.id,
                time: 60000
            }).then(i => i.deferUpdate());
        } catch { return interaction.deleteReply() }

        embed.setDescription(
`**Your health:** \`${hp.user}/${maxHP.user}\`
**Boss health:** \`${hp.boss}/${maxHP.boss}\`
**Super:** \`0/30\``)
        .setFooter({ text: 'Game will automatically end after 2 minutes of inactivity.'});

        interaction.editReply({ embeds: [embed], components: rows });
        reply.components = rows;
        
        const collector = reply.createMessageComponentCollector({
            idle: 120000, filter: i => i.user.id == interaction.user.id
        });
        
        collector.on('collect', i => {
            let damage = { user: 0, boss: 0 }
            let shields = { user: false, boss: false }
            let text = { user: '', boss: '' }

            if (i.customId.endsWith('/attack')) {
                damage.user = Math.floor(Math.random() * 11 + 5);
                text.user = `You dealt \`${damage.user}\` damage.`;
            }

            if (i.customId.endsWith('/defend')) {
                if (Math.random() < 0.5) {
                    shields.user = true;
                    text.user = 'You defended the boss attack.'
                } else text.user = 'You tried to defend, but your shield wasn\'t strong enough.'
            }

            if (i.customId.endsWith('/heal')) {
                let num = Math.ceil(Math.random() * 10);
                num = num > maxHP.user ? maxHP.user - hp.user : num;
                hp.user += num
                _super += num;
                text.user = `You healed \`${num}\` health points.`
            }

            if (i.customId.endsWith('/super')) {
                shields.user = true;
                _super = 0;
                let num = Math.ceil(Math.random() * 5 + 10);
                damage.user += num;
                hp.user += (num / 2) > maxHP.user ? maxHP.user - hp.user : Math.floor(num / 2);
                text.user = `You used your SUPER and:\n- Dealt ${num} damage\n- Healed ${~~(num / 2)} HP.`;
            }
            
            damage.boss = Math.ceil(Math.random() * 10);
            if (!shields.user) {
                let num = Math.random();
                if (num > 0.85) {
                    shields.boss = true;
                    if (i.customId.endsWith('/attack')) {
                        text.user = `You would have dealt \`${damage.user}\` damage, but the boss did a nice play.`
                    }
                    text.boss = 'The boss defended your attack.';
                    damage.boss = 0;
                    damage.user = 0;
                } else if (num > 0.70) {
                    text.boss = 'The boss tried to defend your attack, but failed.';
                    damage.boss = 0;
                } else text.boss = `Boss dealt \`${damage.boss}\` damage.`;
            } else {
                text.boss = `You blocked \`${damage.boss}\` damage.`;

                if (!i.customId.endsWith('/super')) _super += Math.floor(damage.boss / 2);
                damage.boss = 0;
            }

            embed.setDescription(`**${text.user}**\n**${text.boss}**`);
            hp.user -= damage.boss;
            hp.boss -= damage.user;

            if (_super < 30) _super -= damage.boss;
            if (!i.customId.endsWith('/super')) _super += damage.user;
            if (_super < 0) _super = 0;
            if (_super > 30) _super = 30;

            reply.components[0].components[2].data.disabled = hp.user == maxHP.user;
            reply.components[1].components[0].data.disabled = _super != 30
            i.update({ embeds: [embed], components: [] });

            setTimeout(() => {
                embed.setTitle(null)
                .setDescription(null)
                .setFooter(null);
                
                if (hp.user < 1 && hp.boss < 1) {
                    hp.user = 0;
                    hp.boss = 0;
                    reply.components = undefined;
                    embed.setTitle('Tie!')
                    .setDescription(`**Both of us got defeated... Good job I guess!**`);
                    collector.stop('tie');
                } else if (hp.user < 1) {
                    hp.user = 0;
                    reply.components = undefined;
                    embed.setTitle('Defeat!')
                    .setDescription(`**The boss defeated you. Better luck next time!**`);
                    collector.stop('lose');
                } else if (hp.boss < 1) {
                    hp.boss = 0;
                    reply.components = undefined;
                    embed.setTitle('You win!')
                    .setDescription('**The boss has been defeated. Well played!**');
                    collector.stop('win');
                }

                embed.setDescription((embed.data.description || '') + '\n\n' + 
`**Your health:** \`${hp.user}/${maxHP.user}\`
**Boss health:** \`${hp.boss}/${maxHP.boss}\`
**Super:** \`${_super}/30\``);
                i.editReply({ embeds: [embed], components: reply.components && [
                    ActionRowBuilder.from(reply.components[0]),
                    ActionRowBuilder.from(reply.components[1])
                ] });
            }, 2500);

        }).on('end', (collected, reason) => {
            switch(reason) {
                case 'idle': {
                    interaction.editReply({ content: 'Game ended due to inactivity.', components: [] });
                } break;
            }
        });
    }
});