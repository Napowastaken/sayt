const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'package',
    description: 'Search for packages. (NPM)',
    options: [{
        name: 'package',
        description: 'Package to search.',
        type: 'String',
        required: true
    }],
    
    async run(interaction, client) {
        const packageName = interaction.options.getString('package').replaceAll(' ', '-').toLowerCase();
        const data = await fetch(`https://registry.npmjs.org/${packageName}/`).then(d => d.json());
        if (data.error == 'Not found' || !data.versions) return interaction.reply({
            content: 'This package does not exist.',
            ephemeral: true
        });
        let embed = new EmbedBuilder().setColor('Random');
        const data2 = data.versions[data['dist-tags']?.latest];
        embed.setDescription(`> **General**
**Package name:** \`${data.name}\`
**Description:** \`${client.escTicks(data.description || 'None')}\`
**Author:** \`${data.author?.name || 'Unknown'}\`
**Created:** <t:${~~(new Date(data.time.created) / 1000)}>
**Keywords:** \`${data.keywords?.join(', ') || 'None'}\`
**License:** \`${data2?.license || 'None'}\`
            
> **Installation info**
**Installation:** \`npm i ${data.name}\`
**Latest version:** \`^${data2?.version}\`
**File count:** \`${data2?.dist.fileCount || 0}\`
**Size:** \`${data2?.dist.unpackedSize > 1000000 ? `${data2?.dist.unpackedSize / 1000000} mb` : `${data2?.dist.unpackedSize / 1000 || 0} kb`}\`
**Dependecies:** \`${Object.keys(data2?.dependencies || {}).join(', ') || 'None'}\`
            
> **Links**
**[Package](https://www.npmjs.com/package/${data.name})
${data.homepage ? `[Documentation](${data.homepage})` : ''}**`)
        interaction.reply({ embeds: [embed] });
    }
});