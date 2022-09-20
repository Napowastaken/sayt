module.exports = class GuildSnipe {
    /**
     * The content of this message, if any.
     * @type {string | undefined}
     */
    content;
    /**
     * The tag of the message author.
     * @type {string}
     */
    author;
    /**
     * An URL to the message attachment, if any.
     * @type {string}
     */
    attachment;

    /** @param {GuildSnipe} options */
    constructor(options) {
        Object.assign(this, options);
    } 
}