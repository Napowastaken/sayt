const { AttachmentBuilder } = require('discord.js');
const BaseCanvas = require('../../utils/classes/BaseCanvas');
const Command = require('../../utils/classes/Command');
const Canvas = require('canvas');

module.exports = new Command({
        
    name: 'divorce',
    description: 'Divorce leads children to the worst places.',
    options: [{
        name: 'image',
        description: 'Image',
        type: 'Attachment',
        required: true,
        canvas: true
    }],

    async run(interaction, client) {
        const image = interaction.options.getAttachment('image');
        const { canvas, ctx } = await new BaseCanvas(500, 503, './src/canvas/assets/divorce.png');
        ctx.drawImage(await Canvas.loadImage(image.url), 164, 313, 190, 190);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'divorce.png' });
        interaction.reply({
            files: [attachment]
        });
    }
});