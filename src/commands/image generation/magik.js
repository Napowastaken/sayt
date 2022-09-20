const { AttachmentBuilder } = require("discord.js");
const Command = require("../../utils/classes/Command");

module.exports = new Command({

    name: 'magik',
    description: 'Magik.',
    options: [{
        name: 'image',
        description: 'Image to magik.',
        type: 'Attachment',
        required: true,
        canvas: true
    },
    {
        name: 'scale',
        description: 'Scale of the effect. Defaults to 5.',
        minValue: 2,
        maxValue: 10,
        type: 'Integer'
    }],

    async run(interaction, client) {
        const image = interaction.options.getAttachment('image');
        const scale = interaction.options.getInteger('scale') || 5;
        await interaction.deferReply();

        const attachment = new AttachmentBuilder(`https://nekobot.xyz/api/imagegen?type=magik&image=${image.url}&intensity=${scale}&raw=1`, { name: 'magik.png' });
        await interaction.followUp({
            content: '**Source: [nekobot.xyz](https://docs.nekobot.xyz)**',
            files: [attachment]
        });
    }
});