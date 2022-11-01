class Reference {
    /** Channel ID of the reference. */
    channelId = '';
    /** Guild ID of the reference. */
    guildId = '';
    /** Message ID of the reference. */
    messageId = '';

    /** @param {Reference} options */
    constructor(options) {
        Object.assign(this, options);
    }

    /** URL to jump to the message. */
    get url() {
        return `https://discord.com/channels/${this.guildId}/${this.channelId}/${this.messageId}`
    }
}

module.exports = class GuildSnipe {
    /**
     * The content of this message, if any.
     * @type {string | undefined}
     */
    content;
    /** The tag of the message author. */
    author = '';
    /**
     * An URL to the message attachment, if any.
     * @type {string | undefined}
     */
    attachment;
    /**
     * Reference to this message, if any.
     * @type {Reference | undefined}
     */
    reference;

    /** @param {GuildSnipe} options */
    constructor(options) {
        Object.assign(this, options);
        this.reference = options.reference && new Reference(options.reference);
    }

}