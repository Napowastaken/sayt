const { AttachmentBuilder } = require('discord.js');
const Command = require('../../utils/classes/Command');
const BaseCanvas = require('../../utils/classes/BaseCanvas.js');
const Canvas = require('canvas');

Canvas.registerFont('./src/canvas/fonts/WhitneyMedium.otf', { family: 'WhitneyMedium' });
Canvas.registerFont('./src/canvas/fonts/WhitneySemibold.otf', { family: 'WhitneySemibold' });

module.exports = new Command({

    name: 'screenshot',
    description: 'Screenshot someone saying whatever you want.',
    options: [{
        name: 'user',
        description: 'User to take a screenshot of.',
        type: 'User',
        required: true
    },
    {
        name: 'text',
        description: 'Text to say.',
        type: 'String',
        required: true,
        maxLength: 75
    }],

    async run(interaction, client) {
        const user = interaction.options.getMember('user') || interaction.options.getUser('user') || interaction.member || interaction.user;
        const text = interaction.options.getString('text');
        const { canvas, ctx, circle } = await new BaseCanvas(700, 102, '#36393f');

        ctx.drawImage(
            await circle(50, user.displayAvatarURL({ extension: 'png', size: 64, forceStatic: true })), 
            30, 28, 50, 50
        );
        ctx.font = '20px WhitneySemibold';
        ctx.fillStyle = user.displayColor ? user.displayHexColor : '#ffffff';
        ctx.fillText(user.displayName || user.username, 100, 46);

        const measure = ctx.measureText(user.displayName || user.username);
        const m = new Date().getUTCMinutes();
        ctx.font = '14px WhitneyMedium';
        ctx.fillStyle = '#a3a6aa'
        ctx.fillText(`Today at ${new Date().getUTCHours()}:${m < 10 ? `0${m}` : m}`, 110 + measure.width, 45);

        ctx.font = '20px WhitneyMedium';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, 100, 74);
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'screenshot.png' });

        interaction.reply({ files: [attachment] });
    }
});