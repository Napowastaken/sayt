const BaseCanvas = require('../../utils/classes/BaseCanvas');
const Canvas = require('canvas');
const Command = require('../../utils/classes/Command');
const { AttachmentBuilder } = require('discord.js');
Canvas.registerFont('./src/canvas/fonts/ArimoBold.ttf', { family: 'ArimoBold' });

module.exports = new Command({

    name: 'notthesame',
    description: 'We are not the same.',
    options: [{
        name: 'text',
        description: 'Write some tex   t',
        type: 'String',
        required: true,
        maxLength: 150
    }],

    async run(interaction, client) {
        const text = BaseCanvas.fitText(interaction.options.getString('text'), 22);
        const { canvas, ctx } = await new BaseCanvas(350, 500, './src/canvas/assets/notthesame.png');

        ctx.fillStyle = '#ffffff';
        ctx.font = '35px ArimoBold';
        ctx.fillText(text, 10, 410 - (Math.ceil(text.length / 22) - 1) * 40);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'notthesame.png' });
        interaction.reply({ files: [attachment] });
    }
});