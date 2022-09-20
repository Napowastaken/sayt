const Canvas = require("canvas");
const { AttachmentBuilder } = require("discord.js");
const BaseCanvas = require("../../utils/classes/BaseCanvas");
const Command = require("../../utils/classes/Command");

module.exports = new Command({

    name: 'ocapacity',
    description: 'Edit the ocapacity of any image.',
    options: [{
        name: 'image',
        description: 'Image to edit ocapacity of.',
        type: 'Attachment',
        canvas: true,
        required: true
    },
    {
        name: 'percentage',
        description: 'Percentage of ocapacity.',
        type: 'Number',
        minValue: 0,
        maxValue: 100,
        required: true
    }],

    async run(interaction, client) {
        await interaction.deferReply();
        const image = interaction.options.getAttachment('image');
        const scale = interaction.options.getNumber('percentage');

        const { canvas, ctx } = await new BaseCanvas(image.width, image.height);
        ctx.globalAlpha = scale / 100;
        ctx.drawImage(await Canvas.loadImage(image.url), 0, 0, canvas.width, canvas.height);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'alpha.png' });
        await interaction.followUp({ content: `**Scale: ${scale}%**`, files: [attachment] });
    }
});