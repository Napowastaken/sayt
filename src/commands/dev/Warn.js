const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const UserContextMenuCommand = require("../../utils/classes/UserContextMenuCommand");
module.exports = new UserContextMenuCommand({

    name: 'Warn',
    permissions: ['BanMembers', 'KickMembers', 'ModerateMembers'],
    guildOnly: true,
    notYourself: true,
    notGuildOwner: true,
    higherRole: true,

    async run(interaction, client) {
        const modal = new ModalBuilder({
            title: `Warn ${interaction.targetUser.tag}`,
            customId: 'Warn/data',

            components: [new ActionRowBuilder().addComponents(
                new TextInputBuilder({
                    label: 'Write the reason of the warning.',
                    maxLength: 440,
                    style: TextInputStyle.Paragraph,
                    required: true,
                    customId: 'reason',
                    placeholder: 'Ex.: Said HTML is a programming language'
                })
            )]
        });

        await interaction.showModal(modal);
        const submit = await interaction.awaitModalSubmit({
            time: 300000, 
            filter: i => i.customId == 'Warn/data'
        });
        const reason = submit.fields.getTextInputValue('reason');
        if (/^[ \n]*$/.test(reason)) return submit.reply({
            content: 'Cannot provide an empty reason.',
            ephemeral: true
        });
        
        const infraction = client.infractions.add({
            user: interaction.targetUser,
            reason: reason,
            type: 'warning', interaction
        });
        submit.reply(`**${client.escMD(interaction.targetUser.tag)}** has been warned.\n\`\`\`${client.escTicks(reason)}\`\`\``)
    }
});