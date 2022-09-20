const Command = require("../../utils/classes/Command");
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
module.exports = new Command({

    name: 'request',
    description: 'Send a request.',
    ownerOnly: true,
    options: [{
        name: 'url',
        description: 'The URL.',
        type: 'String',
        required: true
    },
    {
        name: 'method',
        description: 'Request method.',
        type: 'String',
        choices: [{ name: 'Get (Default)', value: 'get' },
        { name: 'Post', value: 'post' },
        { name: 'Put', value: 'put' },
        { name: 'Patch', value: 'patch' },
        { name: 'Delete', value: 'delete' }]
    },
    {
        name: 'body',
        description: 'JSON body to send along the request.',
        type: 'String'
    },
    {
        name: 'eval_body',
        description: 'Whether to evaluate the body instead of parsing it. Useful to hide data.',
        type: 'Boolean'
    }],

    async run(interaction, client) {
        const url = interaction.options.getString('url');
        const method = interaction.options.getString('method') || 'get';
        const body = interaction.options.getString('body');
        let parsedBody;
        let res;
        try {
            parsedBody = (interaction.options.getBoolean('eval_body') ? eval : JSON.parse)(body || '{}');
            parsedBody.method = method;
        } catch {
            return interaction.reply({
                content: 'Failed to parse JSON body into an object.',
                ephemeral: true
            });
        }

        await interaction.deferReply();
        try {
            /** @type {Response} */
            res = await fetch(url, parsedBody);
        } catch (err) {
            return interaction.reply(`${err}`);
        };
        const json = await res.json().catch(() => {});

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`> **Request**
**URL: ${res.url}**
**Body:** \`${client.escTicks(body || 'None')}\`
**Method:** \`${method}\`

> **Response**
**Status:** \`${res.status} - ${res.statusText}\`
**JSON body**
\`\`\`json\n${JSON.stringify(json || {}, null, 2)}`.slice(0, 4093) + '```');
        await interaction.followUp({ embeds: [embed] });
    }
});