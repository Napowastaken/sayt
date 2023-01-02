const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const BaseCanvas = require('../../utils/classes/BaseCanvas');
const Command = require('../../utils/classes/Command');

module.exports = new Command({

    name: 'textballoon',
    description: 'Create a text balloon.',
    options: [{
        name: 'image',
        description: 'Image below the text balloon.',
        type: 'Attachment',
        required: true,
        canvas: true
    }],

    async run(interaction, client) {
        await interaction.deferReply();
        const image = interaction.options.getAttachment('image');
        const height = (image.height > 256 ? image.height : 256) / 2;
        const { canvas, ctx } = await new BaseCanvas(image.width, height + image.height);
        
        ctx.drawImage(await Canvas.loadImage('./src/canvas/assets/textballoon.png'), 0, 0, canvas.width, height);
        ctx.drawImage(await Canvas.loadImage(image.url), 0, height, canvas.width, canvas.height - height);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'textballoon.png' });
        interaction.followUp({ files: [attachment] });
    }
});