const Command = require("../../utils/classes/Command");
const BaseCanvas = require('../../utils/classes/BaseCanvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = new Command({

    name: 'resize',
    description: 'Resize any image to a specified width and height.',
    options: [{
        name: 'image',
        description: 'Image to resize.',
        type: 'Attachment',
        required: true,
        canvas: true
    },
    {
        name: 'width',
        description: 'The new width.',
        type: 'Integer',
        minValue: 64,
        maxValue: 2048
    },
    {
        name: 'height',
        description: 'The new height.',
        type: 'Integer',
        minValue: 64,
        maxValue: 2048
    }],

    async run(interaction, client) {
        await interaction.deferReply();
        const img = interaction.options.getAttachment('image');
        const width = interaction.options.getInteger('width');
        const height = interaction.options.getInteger('height');
        const { canvas } = await new BaseCanvas(width, height, img.url);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'resize.png' });
        await interaction.followUp({ 
            content: `\`${img.width}x${img.height}px -> ${canvas.width}x${canvas.height}px\``,
            files: [attachment]
        });
    }
});