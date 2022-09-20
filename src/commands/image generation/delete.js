const BaseCanvas = require('../../utils/classes/BaseCanvas');
const Command = require('../../utils/classes/Command');
const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');
module.exports = new Command({

    name: 'delete',
    description: 'Delete something (or someone)',
    options: [{
        name: 'image',
        description: 'Want to delete an image? Sure!',
        type: 'Attachment',
        canvas: true
    },
    {
        name: 'user',
        description: 'User that will be deleted, maybe.',
        type: 'User'
    }],

    async run(interaction, client) {
        const img = interaction.options.getAttachment('image') || interaction.options.getMember('user')
        || interaction.options.getUser('user') || interaction.member || interaction.user;

        const { canvas, ctx } = await new BaseCanvas(480, 240, './src/canvas/assets/delete.png');
        ctx.drawImage(await Canvas.loadImage(img.url || 
        img.displayAvatarURL({ size: 128, extension: 'png', forceStatic: true })), 80, 90, 125, 125);
        
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'delete.png' });
        interaction.reply({ files: [attachment] });
    }
});