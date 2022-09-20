const { AttachmentBuilder } = require("discord.js");
const BaseCanvas = require("../../utils/classes/BaseCanvas");
const Command = require("../../utils/classes/Command");

module.exports = new Command({

    name: 'pixelify',
    description: 'Pixelate an image.',
    options: [{
        name: 'image',
        description: 'Image to pixelify.',
        type: 'Attachment',
        canvas: true,
        required: true
    },
    {
        name: 'scale',
        description: 'Scale of the pixelifying. Defaults to 5.',
        type: 'Number',
        minValue: 1.01,
        maxValue: 15
    }],

    async run(interaction, client) {
        const image = interaction.options.getAttachment('image');
        const scale = interaction.options.getNumber('scale') || 5;

        const { canvas: canvas1 } =
        await new BaseCanvas(image.width / scale, image.height / scale, image.url);
        const { canvas: canvas2 } =
        await new BaseCanvas(image.width, image.height, canvas1);

        const attachment = await new AttachmentBuilder(canvas2.toBuffer(), { name: 'pixelify.png' });
        interaction.reply({ content: `**Scale: ${scale}**`, files: [attachment] });
    }
});