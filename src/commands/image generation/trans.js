const Command = require('../../utils/classes/Command');
const BaseCanvas = require('../../utils/classes/BaseCanvas');
const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = new Command({

    name: 'trans',
    description: 'Create a transgender overlay with either an user avatar or image.',
    options: [{
        name: 'image',
        description: 'Image to transify.',
        type: 'Attachment',
        canvas: true
    },
    {
        name: 'user',
        description: 'User avatar to transify.',
        type: 'User'
    }],

    async run(interaction, client) {
        const img = interaction.options.getAttachment('image') || interaction.options.getMember('user')
        || interaction.options.getUser('user') || interaction.member || interaction.user;

        const { canvas, ctx } = await new BaseCanvas(img.width || 512, img.height || 512, img.url || img.displayAvatarURL({
            extension: 'png',
            size: 512, 
            forceStatic: true
        }));

        ctx.drawImage(await Canvas.loadImage('./src/canvas/assets/trans.png'), 0, 0, canvas.width, canvas.height);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'trans.png' });
        interaction.reply({ files: [attachment] });
    }
});