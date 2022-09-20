const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const BaseCanvas = require('../../utils/classes/BaseCanvas');
const Command = require('../../utils/classes/Command');

module.exports = new Command({

    name: 'zamn',
    description: 'SHE\'S 12???',
    options: [{
        name: 'image',
        description: 'Image to ZAMN!',
        type: 'Attachment',
        canvas: true,
        required: true
    }],

    async run(interaction, client) {
        const image = interaction.options.getAttachment('image');
        const { canvas, ctx } = await new BaseCanvas(512, 425, './src/canvas/assets/zamn.png');
        ctx.drawImage(await Canvas.loadImage(image.url), 256, 64, 250, 360);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'zamn.png' });
        interaction.reply({ files: [attachment] });
    }
});