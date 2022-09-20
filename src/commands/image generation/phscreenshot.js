const { Attachment, AttachmentBuilder } = require("discord.js");
const Command = require("../../utils/classes/Command");

module.exports = new Command({

    name: 'phscreenshot',
    description: 'Screenshot someone in a ph comment.',
    options: [{
        name: 'text',
        description: 'Content of the comment.',
        type: 'String',
        maxLength: 75,
        required: true
    },
    {
        name: 'user',
        description: 'User of the comment. Defaults to yourself.',
        type: 'User'
    }],

    async run(interaction, client) {
        const text = interaction.options.getString('text');
        const user = interaction.options.getMember('user') || interaction.options.getUser('user')
        || interaction.member || interaction.user;
        await interaction.deferReply();

        const attachment = new AttachmentBuilder(
            `https://nekobot.xyz/api/imagegen?type=phcomment&image=${user.displayAvatarURL({ extension: 'png' })}&text=${text}&username=${user.username || user.user.username}&raw=1`,
            { name: 'phscreenshot.png' }
        );
        await interaction.followUp({
            content: `**Source: [nekobot.xyz](https://docs.nekobot.xyz)**`,
            files: [attachment]
        });
        
    }
});