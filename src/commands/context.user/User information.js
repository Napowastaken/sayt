const UserContextMenuCommand = require("../../utils/classes/UserContextMenuCommand");

module.exports = new UserContextMenuCommand({
    name: 'User information',
    permissions: ['ManageGuild'],
    run(interaction, client) {
        const member = interaction.targetMember;
        const user = interaction.targetUser;
        interaction.options.getMember = () => member;
        interaction.options.getUser = () => user;
        client.commands.get('userinfo').run(interaction, client);
    }
})