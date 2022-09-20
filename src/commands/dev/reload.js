const Command = require("../../utils/classes/Command")
module.exports = new Command({

    name: 'reload',
    description: 'Reload all files.',
    ownerOnly: true,
    options: [{
        name: 'deploy_commands',
        description: 'Whether to deploy the commands.',
        type: 'Boolean' 
    }],

    run(interaction, client) {
        for (const file in require.cache) {
            if (!file.includes('node_modules')) delete require.cache[file];
        }
        try { 
            client.loadCommands(interaction.options.getBoolean('deploy_commands'));
        } catch (err) { 
            console.log(err);
        }

        interaction.reply({
            content: 'All files reloaded.',
            ephemeral: true
        });
    }
});