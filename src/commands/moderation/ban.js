const Command = require("../../utils/classes/Command");
const ms = require("../../utils/functions/ms");
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
        name: 'delete_messages_time',
        description: 'Delete messages sent by the user in a specific amount of time.',
        type: 'String'
    },
    {
        name: 'reason',
        description: 'Reason of the ban.',
        type: 'String',
        maxLength: 440
    }],

    run(interaction, client) {
        const member = interaction.options.getUser('member');
        const time = ms(interaction.options.getString('delete_messages_time'));
        if (time && (time.seconds < 1 || time.days > 7)) return interaction.reply({
            content: 'You must provide a valid time between 1 second and 7 days.',
            ephemeral: true
        });

        const reason = interaction.options.getString('reason') || 'No reason provided.';
        
        client.infractions.add({ interaction, callback() {
            interaction.guild.members.ban(member.id, {
                deleteMessageSeconds: time.seconds,
                reason: `Banned by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`
            });
        } });

        interaction.reply(`**${client.escMD(member.tag)}** has been banned.\n\`\`\`${client.escTicks(reason)}\`\`\``);
    }
});