const Command = require("../../utils/classes/Command");
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const subs = ['memes', 'meme'];
module.exports = new Command({

    name: 'meme',
    description: 'Send a random meme from reddit.',

    async run(interaction, client) {
        let data = await fetch(`https://reddit.com/r/${subs[~~(Math.random() * subs.length)]}/randomrising/.json`)
        .then(d => d.json());
        data = data.data?.children.find(d => d.data.url && !d.data.over_18)?.data;
        
        let embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(data.title)
        .setDescription(`
> **Author: [u/${data.author}](https://www.reddit.com/user/${data.author} "u/${data.author}")**
> **[Jump to post](https://reddit.com${data.permalink} "${data.title}")**`)
        .setImage(data.url)
        .setFooter({ text: `${data.ups - data.downs} upvotes - ${data.num_comments} comments - ${data.total_awards_received} awards` })
        interaction.reply({ embeds: [embed] });
    }
});