const Command = require("../../utils/classes/Command");
const fetch = require('node-fetch');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = new Command({

    name: 'reddit',
    description: 'Get information from the reddit API.',
    options: [{
        name: 'user',
        description: 'Information about a reddit user.',
        type: 'Subcommand',
        options: [{
            name: 'user',
            description: 'User to search for.',
            type: 'String',
            required: true
        }]
    },
    {
        name: 'sub',
        description: 'Information about a subreddit.',
        type: 'Subcommand',
        options: [{
            name: 'subreddit',
            description: 'Subreddit to search for.',
            type: 'String',
            required: true
        }]
    },
    {
        name: 'post',
        description: 'Search from some posts based on a query.',
        type: 'Subcommand',
        options: [{
            name: 'query',
            description: 'Query to search for.',
            type: 'String',
            required: true
        }]
    }],

    async run(interaction, client) {
        let embed = new EmbedBuilder()
        .setColor('Random');

        switch(interaction.options.getSubcommand()) {
            case 'user': {
                let user = interaction.options.getString('user').toLowerCase();
                if (user.startsWith('u/')) user = user.slice(2);

                let data = await fetch(`https://reddit.com/user/${user}/about.json`).then(d => d.json());
                if ((data.error == 404) || (data.kind == 'Listing') || !data.data) return interaction.reply({
                    content: `User **${user}** not found.`,
                    ephemeral: true
                });
                data = data.data;

                embed.setThumbnail(data.snoovatar_img)
                .setTitle(data.subreddit.display_name_prefixed + ` (${data.subreddit.title || data.name})`)
                .setDescription(`
> **General**
**About:** \`${client.escTicks(data.subreddit.public_description || 'No info.')}\`
**Followers:** \`${data.subreddit.subscribers}\`
**Bot account:** \`${data.subreddit.subreddit_type != 'user' ? 'Yes' : 'No'}\`
**Premium user:** \`${data.is_gold ? 'Yes' : 'No'}\`
**NSFW account:** \`${data.subreddit.over_18 ? 'Yes' : 'No'}\`
**Creation:** <t:${data.created_utc}>

> **Karma**
**Post karma:** \`${data.link_karma}\`
**Comment karma:** \`${data.comment_karma}\`
**Awarder karma:** \`${data.awarder_karma}\`
**Awardee karma:** \`${data.awardee_karma}\`
**Total:** \`${data.total_karma}\`

> **Links**
**[View profile on reddit](https://reddit.com/user/${data.name} "${data.subreddit.display_name_prefixed}")
[Avatar](${data.snoovatar_img})**`);
                interaction.reply({ embeds: [embed] });
            } break;

            case 'sub': {
                let subreddit = interaction.options.getString('subreddit');
                if (subreddit.startsWith('r/')) subreddit = subreddit.slice(2);

                let data = await fetch(`https://reddit.com/r/${subreddit}/about.json`).then(d => d.json());
                if ((data.error == 404) || (data.kind == 'Listing') || !data.data) return interaction.reply({
                    content: `Subreddit **${subreddit}** not found.`,
                    ephemeral: true
                });
                data = data.data;
                embed.setThumbnail(data.icon_img || data.header_img || 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png')
                .setDescription(`> **General**
**Name:** \`${client.escTicks(data.display_name)}\`
**Title:** \`${client.escTicks(data.title)}\`
**Description:** \`${client.escTicks(data.public_description || 'None')}\`
**Followers:** \`${data.subscribers} (${data.accounts_active} online)\`
**Created: <t:${data.created_utc}:R>**
**Language:** \`${data.lang}\`
                      
> **Security**
**NSFW:** \`${data.over18 ? 'Yes' : 'No'}\`
**Public:** \`${data.subreddit_type == 'public' ? 'Yes' : 'No'}\`
**Can comment:** \`${!data.restrict_commenting ? 'Yes' : 'No'}\`
**Can follow:** \`${data.accept_followers ? 'Yes' : 'No'}\`
                      
> **Links**
**[View sub on reddit](https://reddit.com/r/${subreddit}/ "${data.display_name_prefixed}")` +
(data.icon_img ? `\n[Icon](${data.icon_img})` : '') + 
(data.mobile_banner_img ? `\n[Banner](${data.mobile_banner_image})` : '') +
(data.header_img ? `\n[Header icon](${data.header_img})`: '') + '**');
               interaction.reply({ embeds: [embed] });
            } break;

            case 'post': {
                const query = interaction.options.getString('query');
                const data = await fetch(`https://www.reddit.com/search/.json?q=${query}`).then(d => d.json());
                /** @type { { description: string, image: string, title: string }[] } */
                const results = data.data.children.filter(r => !r.over_18).map(r => r.data).map(result => ({
                    description:
`In **[${result.subreddit_name_prefixed}](https://reddit.com/${result.subreddit_name_prefixed})**
By **[u/${result.author}](https://reddit.com/user/${result.author})**
**(Posted <t:${result.created_utc}:R>)**
**[Go to post](https://reddit.com${result.permalink})**`,
                    image: result.url,
                    title: result.title
                }));
                embed.setDescription(results[0].description)
                .setImage(results[0].image)
                .setTitle(results[0].title)
                .setFooter({ text: `Page 1/${results.length}` });

                let page = 0;
                let row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder({
                        style: ButtonStyle.Secondary, label: 'Previous',
                        customId: 'reddit.post/prev', disabled: true
                    }), new ButtonBuilder({
                        style: ButtonStyle.Secondary, label: 'Next',
                        customId: 'reddit.post/next', disabled: results.length == 1
                    })
                );
                await interaction.reply({ embeds: [embed], components: [row] });
                let reply = await interaction.fetchReply();

                reply.createMessageComponentCollector({
                    idle: 300000, filter: i => i.user.id == interaction.user.id,
                }).on('collect', i => {
                    page += i.customId.endsWith('/next') ? 1 : -1;
                    reply.components[0].components[0].data.disabled = page < 1;
                    reply.components[0].components[1].data.disabled = page == results.length - 1;

                    embed.setDescription(results[page].description)
                    .setImage(results[page].image)
                    .setTitle(results[page].title)
                    .setFooter({ text: `Page ${page + 1}/${results.length}` });
                    
                    i.update({ embeds: [embed], components: [ActionRowBuilder.from(reply.components[0])] });
                }).on('end', () => interaction.editReply({ components: [] }));
            }
        }
    }
});