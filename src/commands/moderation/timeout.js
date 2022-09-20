const ms = require('../../utils/functions/ms');
const Command = require('../../utils/classes/Command');
module.exports = new Command({

    name: 'timeout',
    description: 'Timeout somebody from the server.',
    permissions: ['ModerateMembers'],
    clientPermissions: ['ModerateMembers'],
    guildOnly: true,
    options: [{
        name: 'member',
        description: 'Member to timeout.',
        type: 'User',
        required: true,
        guildMember: true,
        notGuildOwner: true,
        notYourself: true,
        notClient: true,
        higherRole: true,
        botHigherRole: true
    },
    {
        name: 'time',
        description: 'Duration of the timeout.',
        type: 'String',
        required: true
    },
    {
        name: 'reason',
        description: 'Reason of the timeout.',
        type: 'String',
        maxLength: 435
    }],
    
    run(interaction, client) {
        const member = interaction.options.getMember('member');
        const time = ms(interaction.options.getString('time'));
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        if (!time || time.seconds < 1 || time.days > 28) {
            return interaction.reply({
                content: 'Provide a valid time between 1 second (1s) and 28 days (28d).',
                ephemeral: true
            });
        }
        if (member.permissions.has('Administrator')) {
            return interaction.reply({
                content: 'You can\'t timeout members with Administrator permission.',
                ephemeral: true
            });
        }
        
        client.infractions.add({ interaction });
        member.timeout(time.ms, `Timed out by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
        interaction.reply(`**${client.escMD(member.user.tag)}** has been timed out for \`${time.long}.\`\n\`\`\`${client.escTicks(reason)}\`\`\``)
    }
});