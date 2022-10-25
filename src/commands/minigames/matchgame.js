const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require("discord.js");
const Command = require("../../utils/classes/Command");
const items = ['apple', 'pear', 'orange', 'lemon', 'banana', 'watermelon', 'grapes', 'blueberries',
'strawberry', 'cherries', 'pineapple', 'coconut', 'peach'];

const values = {
    apple: '🍎',
    pear: '🍐',
    orange: '🍊',
    lemon: '🍋',
    banana: '🍌',
    watermelon: '🍉',
    grapes: '🍇',
    blueberries: '🫐',
    strawberry: '🍓',
    cherries: '🍒',
    pineapple: '🍍',
    coconut: '🥥',
    peach: '🍑'
}

module.exports = new Command({

    name: 'matchgame',
    description: 'Match game',

    async run(interaction, client) {
        const start = Date.now();
        let gameItems = [...items, ...items];
        /** @type {number?} */
        let guess;
        let sleepy = false;
        gameItems.splice(~~(Math.random() * 26), 1);
        gameItems = gameItems.map(i => ({ value: i, sortValue: Math.random() }))
        .sort((a, b) => a.sortValue - b.sortValue)
        .map(({ value }) => value);
        
        /** @type {ActionRowBuilder[]} */
        let rows = [];

        for (let count = 0; count < 25; count++) {
            if (!(count % 5)) rows[Math.floor(count / 5)] = new ActionRowBuilder();
            rows[Math.floor(count / 5)].addComponents(new ButtonBuilder({
                customId: `${this.name}/${count}`, emoji: '⬛',
                style: ButtonStyle.Secondary
            }));
        }

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`> **How to play**
> Click a button to reveal the item inside and try to remember where is the identical item.
> Once the board is cleared, you win.
**There's one extra item that has no match.**`)
        .setFooter({ text: 'Click any button to start.' });

        await interaction.reply({ components: rows, embeds: [embed] });
        const reply = await interaction.fetchReply();

        const collector = reply.createMessageComponentCollector({
            filter: i => i.user.id == interaction.user.id, idle: 120000,
            componentType: ComponentType.Button
        });

        collector.on('collect', async i => {
            await i.deferUpdate();
            if (sleepy) return collector.collected.delete(collector.collected.lastKey());
            const index = Number(i.customId.split('/')[1]);
            const component = reply.components[~~(index / 5)].components[index % 5].data;
            if (guess != null) {
                const guessComponent = reply.components[~~(guess / 5)].components[guess % 5].data;
                if (gameItems[guess] == gameItems[index]) {
                    component.disabled = true;
                    component.emoji = values[gameItems[index]];
                } else {
                    component.emoji = values[gameItems[index]];
                    component.disabled = true;
                    await interaction.editReply({ components: reply.components.map(c => ActionRowBuilder.from(c)) });
                    sleepy = true;
                    await client.sleep(2000);
                    sleepy = false;

                    component.emoji = '⬛';
                    component.disabled = false;
                    guessComponent.disabled = false;
                    guessComponent.emoji = '⬛';
                }
                guess = null;
            } else {
                guess = index;
                component.disabled = true;
                component.emoji = values[gameItems[index]];
            }
            if (reply.components.every(r => r.components.every(c => c.disabled))) return collector.stop('win')
            await interaction.editReply({ components: reply.components.map(c => ActionRowBuilder.from(c)), embeds: [] });
        }).once('end', (collected, reason) => {
            switch(reason) {
                case 'win': {
                    embed.setDescription(`> **The extra item is: ${values[gameItems.find(item => gameItems.filter(i => i == item).length == 1)]}**`)
                    .setTitle('You win!')
                    .setFooter({ text: `${collected.size} buttons clicked | ${(Date.now() - start) / 1000} seconds taken`});
                    interaction.editReply({ 
                        components: reply.components.map(c => ActionRowBuilder.from(c)),
                        embeds: [embed]
                    });
                } break;
                
                case 'idle': {
                    interaction.editReply({ content: 'Game ended due to inactivity.', components: [] });
                }
            }
        })
    }
});