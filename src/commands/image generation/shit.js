const BaseCanvas = require("../../utils/classes/BaseCanvas");
const Command = require("../../utils/classes/Command");
const Canvas = require('canvas');
const { AttachmentBuilder } = require("discord.js");

module.exports = new Command({

    name: 'shit',
    description: 'Ew, I stepped in shit.',
    options: [{
        name: 'image',
        description: 'Image to overlay, if any.',
        type: 'Attachment',
        canvas: true
    },
    {
        name: 'user',
        description: 'User to overlay, if any.',
        type: 'User'
    }],

    async run(interaction, client) {
        const image = interaction.options.getAttachment('image') || interaction.options.getMember('user')
        || interaction.options.getUser('user') || interaction.member || interaction.user;
        
        const { canvas, ctx } = await new BaseCanvas(399, 564, './src/canvas/assets/shit.png');
        ctx.drawImage(await Canvas.loadImage(
            image.url || image.displayAvatarURL({ extension: 'png', forceStatic: true })
        ), 120, 375, 105, 105);

        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'redacted.png' });
        interaction.reply({ files: [attachment] });
    }
});