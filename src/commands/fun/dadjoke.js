const { EmbedBuilder } = require("discord.js");
const Command = require("../../utils/classes/Command");
const fetch = require('node-fetch');
module.exports = new Command({

    name: 'dadjoke',
    description: 'A really bad joke. Don\'t laugh. You\'ll prob regret it.',

    async run(interaction, client) {
        let data = await fetch('https://reddit.com/r/dadjokes/random/.json')
        .then(d => d.json());
        data = data?.[0].data?.children[0]?.data;

        let embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(data.title)
        .setDescription(`||${data.selftext}||\n
> **Author: [u/${data.author}](https://www.reddit.com/user/${data.author} "u/${data.author}")**
> **[Jump to post](https://reddit.com${data.permalink} "${data.title}")**`)
        .setFooter({ text: `${data.ups - data.downs} upvotes - ${data.num_comments} comments - ${data.total_awards_received} awards` });
        interaction.reply({ embeds: [embed] });
    }
});