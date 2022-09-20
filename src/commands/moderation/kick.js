const Command = require("../../utils/classes/Command");
module.exports = new Command({
    
    name: 'kick',
    description: 'Kick a member from the server.',
    permissions: ['KickMembers'],
    clientPermissions: ['KickMembers'],
    guildOnly: true,
    options: [{
        name: 'member',
        description: 'Member to kick.',
        type: 'User',
        required: true,
        guildMember: true,
        higherRole: true,
        botHigherRole: true,
        notYourself: true,
        notClient: true,
        notGuildOwner: true
    },
    {
        name: 'reason',
        description: 'Reason of the kick.',
        type: 'String',
        maxLength: 440
    }],

    run(interaction, client) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        client.infractions.add({ interaction, callback() {
            member.kick(`Kicked by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
        } });
        interaction.reply(`**${client.escMD(member.user.tag)}** has been kicked.\n\`\`\`${client.escTicks(reason)}\`\`\``);
    }
});