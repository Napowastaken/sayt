const Command = require("../../utils/classes/Command");
const BaseCanvas = require("../../utils/classes/BaseCanvas");
const Canvas = require("canvas");
const { AttachmentBuilder } = require("discord.js");

module.exports = new Command({

    name: 'gay2',
    description: '🏳‍🌈❔',
    options: [{
        name: 'image',
        description: 'Image to 🏳‍🌈❔',
        type: 'Attachment',
        canvas: true,
        required: true
    }],

    async run(interaction, client) {
        const image = interaction.options.getAttachment('image');
        const { canvas, ctx } = await new BaseCanvas(image.width, image.height, image.url);
        ctx.drawImage(await Canvas.loadImage('./src/canvas/assets/gay2.png'),
        image.width / 2, image.height - 71, 106, 51);
        
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'gay2.png' });
        interaction.reply({ files: [attachment] });
    }
});