const fetch = require('node-fetch').default;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Command = require('../../utils/classes/Command');
module.exports = new Command({
	name: 'github',
	description: 'View information with GitHub API.',
	options: [{
		name: 'user',
		description: 'Show information about an user.',
		type: 'Subcommand',
		options: [{
			name: 'username',
			description: 'Username to search for.',
			type: 'String',
			required: true
		}]
    },
	{
		name: 'repository',
		description: 'Show information about a repository.',
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
		.setColor('Random')
		switch(interaction.options.getSubcommand()) {
			case 'user': {
				const user = interaction.options.getString('username');
				const data = await fetch(`https://api.github.com/users/${user}`).then(d => d.json());
				if (data.message == 'Not Found') return interaction.reply({
					content: 'User not found.',
					ephemeral: true
				});
				embed.setThumbnail(data.avatar_url)
				.setDescription(`> **General**
**Name:** \`${client.escTicks(data.login)}\`
**Nickname:** \`${client.escTicks(data.name || 'Not provided.')}\`
**ID:** \`${data.id}\`
**Bio:** \`${client.escTicks(data.bio || 'User does not have a bio.')}\`
**Email:** \`${data.email || 'Unknown'}\`

> **Profile**
**Location:** \`${data.location || 'Not provided.'}\`
**Twitter:** \`${client.escTicks(data.twitter_username || 'Not provided.')}\`
**Company:** \`${client.escTicks(data.company || 'Not provided.')}\`
**Followers:** \`${data.followers}\`
**Following:** \`${data.following}\`

> **Projects**
**Public repos:** \`${data.public_repos}\`
**Public gists:** \`${data.public_gists}\`

> **Profile timestamps**
**Created:** <t:${~~(new Date(data.created_at).getTime() / 1000)}>
**Last updated:** <t:${~~(new Date(data.updated_at).getTime() / 1000)}>

> **Links**
**[User overview](${data.html_url})${data.website ? `\n[Website](${data.website})` : ''}**`);
				interaction.reply({ embeds: [embed] });
			} break;

			case 'repository': {
				const query = interaction.options.getString('query');
				const data = await fetch(`https://api.github.com/search/repositories?q=${query}`).then(d => d.json());
				if (!data.total_count) return interaction.reply({
					content: 'No repositories match your query.',
					ephemeral: true
				});

				let page = 0;
				let row = new ActionRowBuilder().addComponents(new ButtonBuilder({
					label: 'Previous', disabled: true,
					style: ButtonStyle.Secondary, customId: 'github.repository/prev'
				}), new ButtonBuilder({
					label: 'Next', disabled: data.total_count == 1,
					style: ButtonStyle.Secondary, customId: 'github.repository/next'
				}));
				
				const items = data.items.map(i => ({
					thumbnail: i.owner.avatar_url,
					description: `> **General**
**Name: ** \`${client.escTicks(i.name)}\`
**Description:** \`${client.escTicks(i.description || 'None')}\`
**Owner:** \`${client.escTicks(i.owner.login)}\`
**Language:** \`${i.language || 'Unknown'}\`
**Topics:** \`${i.topics.join(', ') || 'None'}\`
**Created:** <t:${~~(new Date(i.created_at).getTime() / 1000)}>
**Updated:** <t:${~~(Math.max(new Date(i.updated_at).getTime(), new Date(i.pushed_at).getTime()) / 1000)}>

> **Misc**
**Forked repository:** \`${i.fork ? 'Yes' : 'No'}\`
**Forks:** \`${i.forks}\`
**Watchers:** \`${i.watchers}\`
**Open issues:** \`${i.open_issues}\`
**Forkable:** \`${i.allow_forking ? 'Yes' : 'No'}\`
**License:** \`${i.license?.name || 'None'}\`

> **Links**
**[Repository](${i.html_url})${i.homepage ? `\n[Homepage](${i.homepage})` : ''}**`
				}));
				embed.setDescription(items[0].description)
				.setThumbnail(items[0].thumbnail)
				.setFooter({ text: `Page 1/${items.length}` });
				interaction.reply({ embeds: [embed], components: [row] });
				const reply = await interaction.fetchReply();
				
				reply.createMessageComponentCollector({
					filter: i => i.user.id == interaction.user.id && i.customId.startsWith('github.repository/'),
					idle: 300000
				}).on('collect', i => {

					page += i.customId.endsWith('/next') ? 1 : -1;
					reply.components[0].components[0].data.disabled = page < 1;
					reply.components[0].components[1].data.disabled = page == items.length - 1;

					embed.setDescription(items[page].description)
					.setThumbnail(items[page].thumbnail)
					.setFooter({ text: `Page ${page + 1}/${items.length}` });
					i.update({ embeds: [embed], components: [ActionRowBuilder.from(reply.components[0])] });

				}).on('end', () => interaction.editReply({ components: [] }));
			}
		}
	}
});