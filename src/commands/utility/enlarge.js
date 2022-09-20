const Command = require("../../utils/classes/Command");
const BaseCanvas = require('../../utils/classes/BaseCanvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = new Command({

    name: 'enlarge',
    description: 'Make any image bigger.',
    options: [{
        name: 'image',
        description: 'Image to enlarge.',
        type: 'Attachment',
        required: true,
        canvas: true
    },
    {
        name: 'scale',
        description: 'Scale of the enlargement. Can include decimals and defaults to 1.5.',
        type: 'Number',
        minValue: 1.01,
        maxValue: 5
    }],

    async run(interaction, client) {
        await interaction.deferReply();
        const img = interaction.options.getAttachment('image');
        const scale = interaction.options.getNumber('scale') || 1.5;
        
        const { canvas } = await new BaseCanvas(img.width * scale, img.height * scale, img.url);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'enlarge.png' });
        await interaction.followUp({ 
            content: `\`${img.width}x${img.height}px -> ${canvas.width}x${canvas.height}px\``,
            files: [attachment]
        });
    }
});