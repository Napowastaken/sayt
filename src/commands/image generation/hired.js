const BaseCanvas = require("../../utils/classes/BaseCanvas");
const Command = require("../../utils/classes/Command");
const Canvas = require('canvas');
const { AttachmentBuilder } = require("discord.js");
Canvas.registerFont('./src/canvas/fonts/ArimoBold.ttf', { family: 'ArimoBold' });

module.exports = new Command({

    name: 'hired',
    description: 'You are hired!',
    options: [{
        name: 'question',
        description: 'A question to ask.',
        type: 'String',
        maxLength: 75,
        required: true
    },
    {
        name: 'answer',
        description: 'The answer to the question.',
        type: 'String',
        maxLength: 25,
        required: true
    },
    {
        name: 'job',
        description: 'Job where you just got hired at!',
        type: 'String',
        maxLength: 16,
        required: true
    }],

    async run(interaction, client) {
        const question = BaseCanvas.fitText(interaction.options.getString('question'), 25);
        const answer = interaction.options.getString('answer');
        const job = interaction.options.getString('job');
        const { canvas, ctx } = await new BaseCanvas(300, 310, './src/canvas/assets/hired.png');
        
        ctx.fillStyle = '#000000';
        ctx.font = '12px ArimoBold';
        ctx.fillText(question, 80 - ctx.measureText(question).width / 2, 53 - (Math.ceil(question.length / 30) - 1) * 12);

        ctx.font = '10px ArimoBold';
        ctx.fillText(answer, 235 - ctx.measureText(answer).width / 2, 15);

        ctx.font = '9px ArimoBold';
        ctx.fillText(job, 155 - ctx.measureText(job).width / 2, 206);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'hired.png' });
        interaction.reply({ files: [attachment] });
    }
});