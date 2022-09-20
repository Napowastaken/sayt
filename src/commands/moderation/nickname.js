const { GuildMember } = require("discord.js");
const Command = require("../../utils/classes/Command");
module.exports = new Command({

    name: 'nickname',
    description: 'Edit someone\'s nickname.',
    permissions: ['ManageNicknames'],
    clientPermissions: ['ManageNicknames'],
    guildOnly: true,
    options: [{
        name: 'member',
        description: 'Member whose nickname will be edited.',
        type: 'User',
        required: true,
        guildMember: true,
        notYourself: true,
        notClient: true,
        notGuildOwner: true,
        higherRole: true,
        botHigherRole: true
    },
    {
        name: 'nickname',
        description: 'New nickname. Leave blank to reset.',
        type: 'String',
        maxLength: 32
    },
    {
        name: 'reason',
        description: 'Reason to set this nickname.',
        type: 'String',
        maxLength: 420
    }],

    async run(interaction, client) {
        /** @type {GuildMember} */
        let member = interaction.options.getMember('member');
        const nickname = interaction.options.getString('nickname') || null;
        const reason = interaction.options.getString('reason');
        member = await member.setNickname(nickname, `Edited by ${interaction.user.tag} (${interaction.user.id}) | ${reason}`);
        interaction.reply(`**${client.escMD(member.user.tag)}'s** nickname has been ${member.nickname ? `set to \`${client.escTicks(member.nickname)}\`` : 'reset.'}`);
    }
});