const { AttachmentBuilder } = require('discord.js');
const BaseCanvas = require('../../utils/classes/BaseCanvas');
const Command = require('../../utils/classes/Command');
const Canvas = require('canvas');
Canvas.registerFont('./src/canvas/fonts/ArimoBold.ttf', { family: 'ArimoBold' });

module.exports = new Command({
    name: '4rules',
    description: 'There are 4 rules.',
    options: [{
        name: 'wish',
        description: '3 rules: No wishing for death, no falling in love, no bring back dead people.',
        type: 'String',
        required: true,
        maxLength: 75
    }],
    async run(interaction, client) {
        const text = BaseCanvas.fitText(interaction.options.getString('wish'), 20);
        const { canvas, ctx } = await new BaseCanvas(480, 530, './src/canvas/assets/4rules.png');
        ctx.font = '20px ArimoBold';
        ctx.fillStyle = '#000000';

        ctx.fillText(text, 15, 270);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: '4rules.png' });
        interaction.reply({ files: [attachment] });
    }
});