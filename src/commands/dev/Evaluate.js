const MessageContextMenuCommand = require("../../utils/classes/MessageContextMenuCommand");
const Discord = require('discord.js');
const Util = require('util');
module.exports = new MessageContextMenuCommand({

    name: 'Evaluate',
    ownerOnly: true,
    
    async run(interaction, client) {
        const message = interaction.targetMessage;
        const input = message.content.match(/```(js|ts)\n(.|\n)+```/i)?.[0];
        if (!input) return interaction.reply({
            content: 'Unable to find any codeblocks to evaluate.',
            ephemeral: true
        });

        let evaluated;
        try { evaluated = await eval(input.slice(5, -3)) } catch (err) {
            return interaction.reply({
                content: `${err}`,
                ephemeral: true
            });
        }
        
        let embed = new Discord.EmbedBuilder()
        .setColor('Random')
        .setDescription(
`> **Input**\n${input}
> **Output**\n\`\`\`js\n${Util.inspect(evaluated)}\`\`\``);
        interaction.reply({ embeds: [embed] });
    }
});