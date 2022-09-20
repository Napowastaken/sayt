const GuildSnipe = require("./GuildSnipe");

module.exports = class EditSnipe extends GuildSnipe {
    /**
     * The old content of this message.
     * @type {string}
     */
    oldContent;
}