const { EmbedBuilder } = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'afk',
    description: 'Set an AFK status. Members who ping you will be notified.',
    options: [{
        name: 'reason',
        description: 'Reason you are AFK.',
        type: 'String',
        maxLength: 100
    },
    {
        name: 'global',
        description: 'Whether to set AFK to every server you are in.',
        type: 'Boolean'
    }],

    run(interaction, client) {
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const global = interaction.options.getBoolean('global') || false;
        client.afks.set(interaction.user.id, { 
            reason: reason,
            global: global,
            guild: interaction.guildId 
        });
        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`**AFK** has been set ${global ? '**globally.**' : `in **${client.escMD(interaction.guild.name)}**`}
\`\`\`${client.escTicks(reason)}\`\`\`* AFK will disappear once you send a message.`);

        interaction.reply({ embeds: [embed] });
    }
})