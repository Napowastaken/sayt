const Discord = require('discord.js');
const InfractionManager = require('./InfractionManager');
const Database = require('saytdb');
const fs = require('fs');
const Command = require('./Command');
const UserContextMenuCommand = require('./UserContextMenuCommand');
const GuildSnipe = require('./GuildSnipe');
const MessageContextMenuCommand = require('./MessageContextMenuCommand');
const EditSnipe = require('./EditSnipe');

module.exports = class Client extends Discord.Client {
    /** @param {Discord.ClientOptions} options */
    constructor(options) {
        super(options || { 
            intents: [
                'Guilds',
                'GuildMessages',
                'GuildPresences',
                'MessageContent',
                'DirectMessages'
            ],
            allowedMentions: { parse: [] },
            partials: [Discord.Partials.Channel],
            makeCache: Discord.Options.cacheWithLimits({
                BaseGuildEmojiManager: 0,
                GuildBanManager: 0,
                GuildEmojiManager: 0,
                GuildInviteManager: 0,
                GuildScheduledEventManager: 0,
                GuildStickerManager: 0,
                ReactionManager: 0,
                ReactionUserManager: 0,
                StageInstanceManager: 0,
                ThreadManager: 0,
                ThreadMemberManager: 0,
                VoiceStateManager: 0
            })
        });
    }
    /** @type {Discord.Collection<string, Command | UserContextMenuCommand | MessageContextMenuCommand>} */
    commands = new Discord.Collection();
    /** @type {Discord.Collection<string, { name: string, commands: string[] }>} */
    categories = new Discord.Collection();
    /** @type {Discord.Collection<Discord.Snowflake, GuildSnipe>} */
    snipes = new Discord.Collection();
    /** @type {Discord.Collection<Discord.Snowflake, EditSnipe>} */
    editSnipes = new Discord.Collection();
    /** @type {Database<('ban' | 'kick' | 'timeout' | 'warning')[]} */
    dms = new Database({ path: './src/database/dms.json' });
    /** @type {Discord.Collection<string, { reason: string, global: boolean, guild?: Discord.Snowflake }>} */
    afks = new Discord.Collection();
    /** @type {Discord.Collection<string, true>} */
    games = new Discord.Collection();
    
    infractions = new InfractionManager(this);
    names = require('../../misc/names.json');
    emotes = require('../../misc/emotes.json');

    async loadCommands(deployCommands) {
        for (const folder of fs.readdirSync('./src/commands')) {
            this.categories.set(folder, {
                name: folder,
                commands: fs.readdirSync(`./src/commands/${folder}`).map(c => c.slice(0, -3))
            });
            for (const file of fs.readdirSync(`./src/commands/${folder}`)) {
                const cmd = require(`../../commands/${folder}/${file}`);
                cmd.category = folder;
                this.commands.set(cmd.name, cmd);
            }
        }
        if (deployCommands) {
            this.application.commands.set(this.commands.filter(c => c.category != 'dev').map(c => c.data));
            this.guilds.cache.get(process.env.GUILD_ID)?.commands.set(this.commands.filter(c => c.category == 'dev').map(c => c.data));

        }
    }

    async start() {
        for (const file of fs.readdirSync('./src/events')) {
            const event = require(`../../events/${file}`);
            this.on(event.name, async (...args) => await (require(`../../events/${file}`).run(this, ...args)));
        }
        await this.login(process.env.TOKEN);
        await this.application.fetch();
        this.loadCommands(true);
    }

    /** @param {string} text */
    toCase(text) {
        let text1 = text[0].toUpperCase();
        let text2 = text.slice(1).toLowerCase();
        return text1 + text2
    }

    /** @param {string} text */
    escTicks(text) {
        while (text.includes('``')) text = text.replaceAll('``', '`\u200b`');
        if (/^`(.|\n)+`$/.test(text)) return ` \`${text} \``;
        else if (text.startsWith('`')) return ` \`${text}\``;
        else if (text.endsWith('`')) return `\`${text} \``;
        else if (text.includes('`')) return `\`${text}\``;
        else return text;
    }

    escMD = Discord.escapeMarkdown

    /** 
     * Wait some time before proceeding with the rest of the code.
     * @param {number} ms Milliseconds to wait.
     * @returns {Promise<void>}
     */
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}