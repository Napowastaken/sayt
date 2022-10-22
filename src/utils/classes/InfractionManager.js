const Database = require('./Database');
const Infraction = require('./Infraction');
const ms = require('../functions/ms');
const { CommandInteraction, Guild, User, Snowflake } = require('discord.js');
/**
 * @typedef {{
 * type?: string
 * user?: User
 * guild?: Guild
 * reason?: string
 * time?: number
 * moderator?: User
 * interaction?: CommandInteraction
 * callback?: () => any
 * }} InfractionAddOptions
 */

/**
 * @typedef {{
 * guild: Snowflake
 * user: Snowflake
 * moderator: Snowflake
 * reason?: string
 * type: 'ban' | 'kick' | 'timeout' | 'warning'
 * id: number
 * timestamp: number
 * time?: number
 * }} PartialInfraction
 */
module.exports = class InfractionManager extends Database {

    constructor(client) {
        /** @type {Database<PartialInfraction>} */
        super({ path: './src/database/infractions.json' });
        this.client = client;
    }

    /** @param {InfractionAddOptions} obj */
    add(obj) {
        if (!obj.user) obj.user = obj.interaction?.options.getUser('member') || obj.interaction?.options.getUser('user');
        if (!obj.reason) obj.reason = obj.interaction?.options.getString('reason');
        if (!obj.time) obj.time = ms(obj.interaction?.options.getString('time'))?.ms;
        if (!obj.type) obj.type = obj.interaction?.commandName;
        if (!obj.guild) obj.guild = obj.interaction?.guild;
        if (!obj.moderator) obj.moderator = obj.interaction?.user;

        const id = Object.keys(this.content).length + 1;
        if (!obj.user) throw new Error('Missing "user" argument.');
        if (!obj.guild) throw new Error('Missing "guild" argument.');

        this.set(`${id}`, {
            guild: obj.guild.id,
            user: obj.user.id,
            moderator: obj.moderator.id,
            reason: obj.reason,
            type: obj.type,
            id: id,
            timestamp: Date.now(),
            duration: obj.time
        });
        const infraction = new Infraction(id, this.client, obj.interaction);
        this.client.emit('guildMemberInfractionAdd', infraction, obj.callback);
        return infraction;
    }

    /**
     * @param {number|string} id
     * @returns {PartialInfraction | undefined}
    */
    getPartial(id) {
        return this.content[`${id}`];
    }

    /**
     * @returns {Infraction}
     * @param {number|string} id
    */
    get(id) {
        return this.getPartial(id) && new Infraction(id, this.client);
    }

    /**
     * @param {number} id
     */
    remove(id) {
        const infraction = this.get(id);
        this.set(`${id}`, null);
        return infraction;
    }

    /**
     * @param {Snowflake} [userId]
     * @param {Snowflake} [guildId]
     * @returns {Infraction[]}
     */
    all(userId, guildId) {
        if (userId && guildId) {
            return this.filter(i => i?.guild == guildId && i?.user == userId).map(i => this.get(i.id));
        } else {
            return this.values().map(i => new Infraction(i.id));
        }
    }
}