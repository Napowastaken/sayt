const { ChatInputCommandInteraction, Guild, User } = require('discord.js');
const Client = require('./Client');
const ms = require('../functions/ms');

module.exports = class Infraction {
    /** 
     * @param {ChatInputCommandInteraction} [interaction]
     * @param {Client} client
     * @param {Number} id
     */
    constructor(id, client, interaction) {

        const infraction = client.infractions.getPartial(id);
        /**
         * The client that initialized this.
         * @type {Client}
         */
        this.client = client;
        /**
         * ID of the user of this infraction.
         * @type {string}
         */
        this.userId = infraction.user;
        /**
         * ID of the guild from this infraction.
         * @type {string}
         */
        this.guildId = infraction.guild;
        /**
         * ID of the moderator that created the infraction.
         * @type {string}
         */
        this.moderatorId = infraction.moderator;
        /**
         * User of the infraction, null if uncached.
         * @type {?User}
         */
        this.user = client.users.cache.get(this.userId) || null;
        /**
         * Guild from the infraction, null if uncached.
         * @type {?Guild}
         */
        this.guild = client.guilds.cache.get(this.guildId) || null;
        /**
         * Moderator that created the interaction, null if uncached.
         * @type {?User}
         */
        this.moderator = client.users.cache.get(this.moderatorId) || null;
        /**
         * Type of the infraction.
         * @type {PartialInfraction['type']}
         */
        this.type = infraction.type;
        /**
         * Reason of the infraction.
         * @type {?string}
         */
        this.reason = infraction.reason;
        /**
         * ID of the infraction.
         * @type {number}
         */
        this.id = id;
        /**
         * Timestamp in milliseconds when the infraction was created.
         * @type {number}
         */
        this.timestamp = infraction.timestamp;
        /**
         * Duration in milliseconds of the infraction, if it was a timeout.
         * @type {?number}
         */
        this.duration = infraction.duration || null;
        /**
         * String based duration of the infraction, if it was a timeout.
         * @type {?string}
         */
        this.stringDuration = ms(infraction.duration)?.long;
        /**
         * Interaction that initialized the infraction, if any.
         * @type {?Infraction}
         */
        this.interaction = interaction || null;
        /**
         * Infraction data stored in the database.
         */
        this.partial = infraction;
    }

    /**
     * Fetches the user of this infraction.
     * @returns {Promise<User>}
     */
    async fetchUser() {
        this.user = await this.client.users.fetch(this.userId);
    }

    /**
     * Fetches the guild from this infraction.
     * @returns {Promise<Guild>}
     */
    async fetchGuild() {
        this.guild = await this.client.guilds.fetch(this.guildId);
    }

    /**
     * Fetches the moderator that created this infraction.
     * @returns {Promise<User>}
     */
    async fetchModerator() {
        this.moderator = await this.client.users.fetch(this.moderatorId);
    }
}