const util = require('util');
const Discord = require('discord.js');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'eval',
    description: 'Evaluate some code.',
    ownerOnly: true,
    options: [{
        name: 'code',
        description: 'Code to evaluate.',
        type: 'String',
        required: true
    },
    {
        name: 'ephemeral',
        description: 'Should reply be ephemeral?',
        type: 'Boolean'
    }],

    async run(interaction, client) {
        const code = interaction.options.getString('code');
        let output;

        try { output = await eval(code) } catch (err) {
            return interaction.reply({
                content: `${err}`,
                ephemeral: true
            });
        }

        let embed = new Discord.EmbedBuilder()
        .setColor('Random')
        .setDescription(`
> **Input**
\`\`\`js\n${code}\`\`\`
> **Output**
\`\`\`js\n${util.inspect(output).slice(0, 4051 - code.length)}\`\`\``);
        interaction.reply({
            embeds: [embed],
            ephemeral: interaction.options.getBoolean('ephemeral')
        });
    }
});