const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'rate',
    description: 'Let me rate something from 1 to 5.',
    options: [{
        name: 'input',
        description: 'Input to rate.',
        type: 'String',
        required: true,
        maxLength: 1000
    }],

    run(interaction, client) {
        const input = interaction.options.getString('input');
        const rate = (~~(Math.random() * 9) + 2) / 2;
        const fullStars = ':star:'.repeat(~~rate);
        const halfStar = rate % 1 ? client.emotes.halfstar : '';
        const emptyStars = client.emotes.blackstar.repeat(~~(5 - rate));
        
        interaction.reply(`I rate \`${client.escTicks(input)}\` **${rate} star${rate != 1 ? 's' : ''}** ${fullStars}${halfStar}${emptyStars}`);
    }
});