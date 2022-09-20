const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'percentage',
    description: 'Calculate how much of something is someone.',
    options: [
    {
        name: 'target',
        description: 'Target to calculate percentage of.',
        type: 'String',
        required: true,
        maxLength: 500
    },
    {
        name: 'input',
        description: 'Input to calculate.',
        type: 'String',
        required: true,
        maxLength: 500
    }],

    run(interaction, client) {
        const target = interaction.options.getString('target');
        const input = interaction.options.getString('input');
        const percentage = ~~(Math.random() * 101);
        interaction.reply(`I will tell you **${client.escMD(target)}** is **${percentage}%** \`${client.escTicks(input)}\``)
    }
});