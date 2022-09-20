const Command = require('../../utils/classes/Command.js');
module.exports = new Command({

    name: 'warn',
    description: 'Warn a member. They won\'t be punished, but an infraction will be added.',
    guildOnly: true,
    permissions: ['BanMembers', 'KickMembers', 'ModerateMembers'],
    options: [{
        name: 'member',
        description: 'Member to warn.',
        type: 'User',
        required: true,
        higherRole: true,
        notYourself: true,
        notGuildOwner: true
    },
    {
        name: 'reason',
        description: 'Reason of the warning.',
        type: 'String',
        required: true,
        maxLength: 440
    }],

    run(interaction, client) {
        const member = interaction.options.getUser('member');
        const reason = interaction.options.getString('reason');
        client.infractions.add({ type: 'warning', interaction });
        interaction.reply(`**${client.escMD(member.tag)}** warned.\n\`\`\`${client.escTicks(reason)}\`\`\``);
    }
});