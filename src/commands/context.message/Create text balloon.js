const MessageContextMenuCommand = require("../../utils/classes/MessageContextMenuCommand");

module.exports = new MessageContextMenuCommand({

    name: 'Create text balloon',
    withAttachment: true,
    compatibleWithCanvas: true,

    async run(interaction, client) {
        const attachment = interaction.targetMessage.attachments.first();
        interaction.options.getAttachment = () => attachment;
        await client.commands.get('textballoon').run(interaction, client);
        await interaction.followUp(`**[Original message](<${interaction.targetMessage.url}>)**`);
    }

});