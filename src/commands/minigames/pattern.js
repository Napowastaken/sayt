const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const Command = require("../../utils/classes/Command");
const values = {
    r: '🟥',
    b: '🟦',
    y: '🟨',
    g: '🟩',
    '': '⬛'
}
module.exports = new Command({

    name: 'pattern',
    description: 'Remember and memorize a pattern. That\'s it!',
    options: [{
        name: 'blocks_count',
        description: 'Number of blocks to remember. Defaults to 4.',
        type: 'Integer',
        minValue: 1,
        maxValue: 8
    }],

    async run(interaction, client) {
        const blocks = interaction.options.getInteger('blocks_count') || 4;
        const colors = ['r', 'b', 'y', 'g'];
        /** @type {('r' | 'b' | 'y' | 'g')[]} */
        let pattern = [];
        let showcase = [''];

        for (let count = 0; count < blocks; count++) {
            pattern.push(colors[~~(Math.random() * 4)]);
        }

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('Remember the pattern!')
        .setDescription(`${values[pattern[0]]} | ${Array(blocks - 1).fill(values['']).join(' | ')}`)
        await interaction.reply({ embeds: [embed] });

        let row = new ActionRowBuilder().addComponents(colors.map(c => new ButtonBuilder({
            customId: `pattern/${c}`, emoji: values[c], style: ButtonStyle.Secondary
        })))
        
        for (let count = 1; count < blocks; count++) {
            await client.sleep(2000);

            showcase = Array(blocks).fill(values['']);
            showcase[count] = values[pattern[count]];
            embed.setDescription(showcase.join(' | '));

            await interaction.editReply({ embeds: [embed] });
        }

        await client.sleep(2000);
        embed.setTitle('Now repeat the previously shown pattern.')
        .setDescription(Array(blocks).fill(values['']).join(' | '));
        await interaction.editReply({ embeds: [embed], components: [row] });
        
        let count = 0;
        const reply = await interaction.fetchReply();
        const collector = reply.createMessageComponentCollector({
            filter: i => i.user.id == interaction.user.id, idle: 15000,
            componentType: ComponentType.Button
        });

        collector.on('collect', i => {
            let color = i.customId.at(-1);
            if (color == pattern[count]) {
                showcase = Array(blocks).fill(values['']);
                showcase[count] = values[color];
                embed.setDescription(showcase.join(' | '));
            } else return collector.stop('lose');

            count++;
            if (count == blocks) return collector.stop('win');
            i.update({ embeds: [embed] });
        }).once('end', (collected, reason) => {

            let content = '';
            switch(reason) {
                case 'idle': {
                    content = 'Game ended due to inactivity.'
                } break;
                case 'win': {
                    content = '**You win!**'
                } break;
                case 'lose': {
                    content = 'An incorrect color was pressed. **Better luck next time!**'
                }
            }

            embed.setTitle(null)
            .setDescription(`**The pattern was:**\n${pattern.map(c => values[c]).join(' | ')}`);
            interaction.editReply({ content, embeds: [embed], components: [] });

        });

    }
});