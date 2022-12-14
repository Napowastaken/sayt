const { EmbedBuilder } = require('discord.js');
const Command = require('../../utils/classes/Command');
const replies = [
    `Take this 🛌. That's so you keep on dreaming.`,
    `I don't know and I don't care.`,
    `I prefer not talking about it.`, 
    `What kind of question is this`, 
    `✨ Y E S ✨`,
    `✨ N O ✨`,
    `I don't think so. Do you?`,
    `what the heck is this question`,
    `Maybe. Maybe.`,
    `Sure. And they are lying about it.`,
    `This is false. Source: me`,
    `You got a nice question ngl`,
    `This is an 8 ball. Not a reality changer.`,
    `I didn't understand. Could you repeat the question?`,
    `Give me a question like this again and I will ban you.`,
    `Yeah, and I'm Bill Gates`,
    `Go ask your father, I mean here he is: \u200b \u200b \u200b `
]

module.exports = new Command({

    name: '8ball',
    description: 'Ask something to the magic 8ball.',
    options: [{
        name: 'question',
        description: 'Question to ask.',
        type: 'String',
        required: true,
        maxLength: 2000
    }],
    
    run(interaction, client) {
        const question = interaction.options.getString('question');
        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`**You asked:**
\`${client.escTicks(question)}\`
        
:8ball: **And the 8ball says:**
\`${replies[Math.floor(Math.random() * replies.length)]}\``);
        interaction.reply({ embeds: [embed] });
    }
});