const { ApplicationCommandPermissionType, Role } = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({
    
    name: 'serverconfig',
    description: 'Edit the configuration of the server.',
    permissions: ['ManageGuild'],
    guildOnly: true,
    options: [{
        name: 'dms',
        description: 'Configurate direct messages in moderation actions.',
        type: 'Subcommand',
        options: [{
            name: 'type',
            description: 'Type of action.',
            type: 'String',
            required: true,
            choices: [{ name: 'Ban', value: 'ban' },
            { name: 'Kick', value: 'kick' },
            { name: 'Timeout', value: 'timeout' },
            { name: 'Warn', value: 'warning' }]
        },
        {
            name: 'value',
            description: 'Whether to enable or disable DM. If none is provided, show your current config.',
            type: 'Boolean',
        }],
    }],

    run(interaction, client) {
        switch(interaction.options.getSubcommand()) {
            case 'dms': {
                const type = interaction.options.getString('type');
                const value = interaction.options.getBoolean('value');
                const dms = client.dms.get(interaction.guild.id);
                if (value == null) interaction.reply({
                    content: `\`${client.toCase(type)}\` direct messages are \`${dms.includes(type) ? 'enabled' : 'disabled'}\` in this server.`,
                    ephemeral: true
                });
                else {
                    if (value) client.dms.push(interaction.guild.id, type);
                    else client.dms.removeFromList(interaction.guild.id, type);
                    interaction.reply(`**Members who get a ${type} will ${value ? 'now' : 'no longer'} be informed in direct messages${value ? ', without containing the moderator.' : '.'}**`);
                }
            } break;
        }
    }
});