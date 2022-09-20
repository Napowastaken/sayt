const Command = require('../../utils/classes/Command');
const { EmbedBuilder } = require('discord.js');
module.exports = new Command({

    name: 'icon',
    description: 'Show server\'s icon.',
    guildOnly: true,
    options: [
    {
        name: 'size',
        description: 'Size of the icon. Defaults to 512px.',
        type: 'Integer',
        choices: [{ name: 128, value: 128 },
        { name: 256, value: 256 },
        { name: 512, value: 512},
        { name: 1024, value: 1024 },
        { name: 2048, value: 2048 },
        { name: 4096, value: 4096 }]
    }],

    run(interaction, client) {
        const size = interaction.options.getInteger('size') || 512;
        const icon = interaction.guild.iconURL({ size: size, extension: 'png' });

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setAuthor({ iconURL: icon, name: `${interaction.guild.name}'s icon` })
        .setDescription(`**[URL](${icon}) | ${size}px**`)
        .setImage(icon);

        interaction.reply({ embeds: [embed] });
    }
});