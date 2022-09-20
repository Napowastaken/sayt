const Command = require("../../utils/classes/Command");
module.exports = new Command({
    
    name: 'ban',
    description: 'Ban a member, even if they are not in the server.',
    permissions: ['BanMembers'],
    clientPermissions: ['BanMembers'],
    guildOnly: true,
    options: [{
        name: 'member',
        description: 'Member to ban.',
        type: 'User',
        required: true,
        higherRole: true,
        botHigherRole: true,
        notYourself: true,
        notClient: true,
        notGuildOwner: true
    },
    {
        name: 'delete_message_days',
        description: 'Delete messages sent by the user in a specific amount of days. Defaults to none.',
        type: 'Integer',
        minValue: 0,
        maxValue: 7
    },
    {
        name: 'reason',
        description: 'Reason of the ban.',
        type: 'String',
        maxLength: 440
    }],

    run(interaction, client) {
        const member = interaction.options.getUser('member');
        const days = interaction.options.getInteger('days') || 0;
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        
        client.infractions.add({ interaction, callback() {
            interaction.guild.members.ban(member.id, {
                days: days,
                reason: `Banned by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`
            });
        } });

        interaction.reply(`**${client.escMD(member.tag)}** has been banned.\n\`\`\`${client.escTicks(reason)}\`\`\``);
    }
});