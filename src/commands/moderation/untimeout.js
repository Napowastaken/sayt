const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'untimeout',
    description: 'Remove the timeout from someone who was previously timed out.',
    permissions: ['ModerateMembers'],
    clientPermissions: ['ModerateMembers'],
    guildOnly: true,
    options: [{
        name: 'member',
        description: 'Member to untimeout.',
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
        name: 'reason',
        description: 'Reason of the untimeout.',
        type: 'String',
        maxLength: 430
    }],
    
    run(interaction, client) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        if (!member.isCommunicationDisabled()) return interaction.reply({
            content: `**${member.user.tag}** is not timed out.`,
            ephemeral: true
        });
        member.timeout(null, `Untimed out by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
        interaction.reply(`**${client.escMD(member.user.tag)}'s** timeout has been removed.`)
    }
});