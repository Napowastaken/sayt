const Command = require('../../utils/classes/Command');
module.exports = new Command({
    
    name: 'unban',
    description: 'Unban any member from this server.',
    permissions: ['BanMembers'],
    clientPermissions: ['BanMembers'],
    guildOnly: true,
    options: [{
        name: 'member_id',
        description: 'Member ID to unban.',
        type: 'User',
        required: true,
        notYourself: true,
        notClient: true,
        notGuildOwner: true
    },
    {
        name: 'reason',
        description: 'Reason for the unban.',
        type: 'String',
        maxLength: 435
    }],

    async run(interaction, client) {
        const member = interaction.options.getUser('member_id');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const bans = await interaction.guild.bans.fetch();
        if (!bans.has(member.id)) return interaction.reply({
            content: 'This member is not banned.',
            ephemeral: true
        });

        await interaction.guild.members.unban(member.id, `Unbanned by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
        interaction.reply(`**${client.escMD(member.tag)}** unbanned.`);
    }
});