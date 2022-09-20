// This event is completely unused right now but it will be useful when handling autocomplete
const { InteractionType, AutocompleteInteraction } = require("discord.js");
const { CommandOptionsOption } = require('../utils/classes/Command');
const Event = require("../utils/classes/Event");

module.exports = new Event({
    name: 'interactionCreate',

    /** @param {AutocompleteInteraction} interaction */
    async run(client, interaction) {
        if (interaction.type != InteractionType.ApplicationCommandAutocomplete) return;
        const focused = interaction.options.getFocused(true);
        const value = focused.value.toLowerCase();

        /** @type {CommandOptionsOption} */
        const option = client.commands.get(interaction.commandName)
        .options?.find(o => o.name == focused.name);

        const values = (Array.isArray(option.autocomplete) ? option.autocomplete
        : await option.autocomplete(interaction, client))
        .sort().sort((a, b) => /^\w+$/.test(b) - /^\w+$/.test(a));

        await interaction.respond(
            values.filter(v => v.toLowerCase().includes(value))
            .sort((a, b) =>
                b.toLowerCase().startsWith(value) - a.toLowerCase().startsWith(value) ||
                b.toLowerCase().includes(value) - a.toLowerCase().includes(value)
            )
            .map(v => ({ name: v, value: v }))
            .slice(0, 25)
        );
    }
});