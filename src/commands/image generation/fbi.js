const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const Command = require('../../utils/classes/Command');
const BaseCanvas = require('../../utils/classes/BaseCanvas');
Canvas.registerFont('./src/canvas/fonts/RobotoRegular.ttf', { family: 'RobotoRegular' });

module.exports = new Command({

    name: 'fbi',
    description: 'Why is the fbi here',
    options: [{
        name: 'text',
        description: 'A google search which will be the reason fbi is at your house', 
        type: 'String',
        required: true,
        maxLength: 40
    }],

    async run(interaction, client) {
        const text = interaction.options.getString('text');
        const { canvas, ctx } = await new BaseCanvas(664, 372, './src/canvas/assets/fbi.png');
        ctx.fillStyle == '#000000';
        ctx.font = '30px RobotoRegular';
        ctx.fillText(text, 25, 245);
        
        const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'fbi.png' });
        interaction.reply({
            files: [attachment]
        });
    }
});