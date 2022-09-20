const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'role',
    description: 'Add or remove roles from members.',
    permissions: ['ManageRoles'],
    clientPermissions: ['ManageRoles'],
    guildOnly: true,
    options: [{
        name: 'add',
        description: 'Add a role.',
        type: 'Subcommand',
        options: [{
            name: 'member',
            description: 'Member to add the role to.',
            type: 'User',
            required: true,
            guildMember: true
        },
        {
            name: 'role',
            description: 'Role to add.',
            type: 'Role',
            required: true,
            higher: true,
            higherFromBot: true,
            notIntegrated: true
        },
        {
            name: 'reason',
            description: 'Reason to add this role.',
            type: 'String',
            maxLength: 440
        }]
    },
    {
        name: 'remove',
        description: 'Remove a role.',
        type: 'Subcommand',
        options: [{
            name: 'member',
            description: 'Member to remove the role from.',
            type: 'User',
            required: true,
            guildMember: true
        },
        {
            name: 'role',
            description: 'Role to remove.',
            type: 'Role',
            required: true,
            higher: true,
            higherFromBot: true,
            notIntegrated: true
        },
        {
            name: 'reason',
            description: 'Reason to remove this role.',
            type: 'String',
            maxLength: 440
        }]
    }],

    run(interaction, client) {
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        switch(interaction.options.getSubcommand()) {
            case 'add': {
                if (member._roles.includes(role.id)) return interaction.reply({
                    content: `**${client.escMD(member.user.tag)}** already has this role.`,
                    ephemeral: true
                });
                member.roles.add(role, `Added by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
                interaction.reply(`${role} has been added to **${client.escMD(member.user.tag)}.**`);
            } break;

            case 'remove': {
                if (!member._roles.includes(role.id)) return interaction.reply({
                    content: `**${client.escMD(member.user.tag)}** does not have this role.`,
                    ephemeral: true
                });
                member.roles.remove(role.id, `Removed by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
                interaction.reply(`${role} has been removed from **${client.escMD(member.user.tag)}.**`);
            } break;
        }
    }
});