const Command = require("../../utils/classes/Command");
const Canvas = require('canvas');
const BaseCanvas = require("../../utils/classes/BaseCanvas");
const { AttachmentBuilder } = require("discord.js");
Canvas.registerFont('./src/canvas/fonts/ArimoBold.ttf', { family: 'ArimoBold' });

module.exports = new Command({

    name: 'society',
    description: 'Society if',
    options: [{
        name: 'text',
        description: 'The text',
        type: 'String',
        maxLength: 35,
        required: true
    }],

    async run(interaction, client) {
        const text = interaction.options.getString('text');
        const { canvas, ctx } = await new BaseCanvas(657, 500, './src/canvas/assets/society.png');
        
        ctx.font = '40px ArimoBold';
        ctx.fillStyle = '#000000';
        ctx.fillText(text, 328 - ctx.measureText(text).width / 2, 100);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'society.png' });
        interaction.reply({ files: [attachment] });
    }
});