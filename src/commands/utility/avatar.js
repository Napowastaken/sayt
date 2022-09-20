const Command = require('../../utils/classes/Command');
const { EmbedBuilder } = require('discord.js');
module.exports = new Command({

    name: 'avatar',
    description: 'Show your avatar or someone else\'s.',
    options: [{
        name: 'user',
        description: 'User to show avatar of.',
        type: 'User'
    },
    {
        name: 'size',
        description: 'Size of the avatar. Defaults to 512px.',
        type: 'Integer',
        choices: [{ name: 128, value: 128 },
        { name: 256, value: 256 },
        { name: 512, value: 512},
        { name: 1024, value: 1024 },
        { name: 2048, value: 2048 },
        { name: 4096, value: 4096 }]
    }],

    run(interaction, client) {
        const user = interaction.options.getMember('user') || interaction.options.getUser('user') || interaction.member || interaction.user;
        const size = interaction.options.getInteger('size') || 512;
        const avatar = user.displayAvatarURL({ size: size, extension: 'png' });
        const userAvatar = user.user && user.avatar ?
        user.user.avatarURL({ size: size, extension: 'png' }) : undefined;

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ iconURL: avatar, name: `${user.tag || user.user.tag}'s avatar` })
        .setDescription(`**${userAvatar ? `[Member](${avatar}) | [User](${userAvatar})`
        : `[URL](${avatar})`} | ${size}px**`)
        .setImage(avatar)
        .setThumbnail(userAvatar);

        interaction.reply({ embeds: [embed] });
    }
});