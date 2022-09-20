const { Message } = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'numberguess',
    description: 'A random number will be hidden and I will guide you through it.',
    options: [{
        name: 'limit',
        description: 'How high your number can be.',
        type: 'Integer',
        required: true,
        minValue: 10
    }],

    async run(interaction, client) {
        if (client.games.has(interaction.user.id)) return interaction.reply({
            content: 'You already have a game going on.',
            ephemeral: true
        });

        const limit = interaction.options.getInteger('limit');
        const number = Math.floor(Math.random() * limit) + 1;
        /** @type {Message} */
        let message;

        try {
            message = await interaction.user.send(`A number between \`1\` and \`${limit}\` has been hidden.
**Type any number to start or send \`STOP\` to end the game.
Also note that the game will end after 5 minutes of inactivity.**`);
        } catch {
            return interaction.reply({
                content: `I couldn't DM you as you seem to have closed direct messages, enable them and try again.`,
                ephemeral: true
            });
        }

        interaction.reply({
            content: 'Your game started in direct messages.',
            ephemeral: true
        });

        const collector = message.channel.createMessageCollector({
            idle: 300000,
            filter: m => m.author.id == interaction.user.id
        });
        client.games.set(interaction.user.id, true);

        collector.on('collect', m => {

            const num = Number(m.content);
            if (m.content.toUpperCase() == 'STOP') return collector.stop('manuallyStopped');

            if (!num || (num % 1)) {
                collector.collected.delete(collector.collected.lastKey());
                return m.reply('Not a number.');
            }

            if (num == number) return collector.stop('guessed');
            m.reply(`Your number was too **${num < number ? 'low' : 'high'}.**
Try going **${num < number ? 'higher' : 'lower'}.**`);

        }).on('end', (collected, reason) => {
            client.games.delete(interaction.user.id);
            switch(reason) {
                case 'idle': {
                    message.channel.send(`Game finished due to inactivity. The number was \`${number}\`.`);
                } break;
                case 'manuallyStopped': {
                    message.channel.send(`Your game was ended successfully. The number was \`${number}\`.`);
                } break;
                case 'guessed': {
                    collected.last().reply(`**Congratulations!** You guessed the right number. **GG!**
Took \`${collector.collected.size}\` attempts.`);
                } break;
            }
        });
    }
});