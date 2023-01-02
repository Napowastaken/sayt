const { MessageContextMenuCommandInteraction, PermissionResolvable, ApplicationCommandType } = require('discord.js');
const Client = require('./Client');
/** @typedef {(interaction: MessageContextMenuCommandInteraction, client: Client) => any} RunFunction */
/**
 * @typedef {object} CommandOptions
 * @property {string} name The name of the command.
 * @property {PermissionResolvable[]} [permissions] Default permissions the interaction member must have
 * to execute the command. Keep in mind server administrators can change what permissions are needed,
 * this is just what it defaults to.
 * @property {PermissionResolvable[]} [clientPermissions] What permissions the client must have to execute
 * the command.
 * @property {boolean} [guildOnly] Whether this command can only be used in guilds and not DMs. Defaults to false.
 * @property {boolean} [ownerOnly] Whether this command can only be used by the owner of the bot. Defaults to false.
 * @property {boolean} [withContent] Whether the message must have content in it.
 * @property {RunFunction} run The callback of the command.
 */

module.exports = class MessageContextMenuCommand {

    /** 
     * The name of the command.
     * @type {string}
     */
    name;
    /** 
     * The default permissions of the command. 
     * @type {PermissionResolvable[] | undefined} 
     */
    permissions;
    /** 
     * The permissions the client needs to execute the command.
     * @type {PermissionResolvable[] | undefined}
     */
    clientPermissions;
    /** 
     * Whether this command can only be used in guilds. 
     * @type {boolean | undefined}
     */
    guildOnly;
    /** 
     * Whether this command can only be used by the owner of the bot.
     * @type {boolean | undefined}
     */
    ownerOnly;
    /**
     * Whether the message of this command must have content.
     */
    withContent;
    /** 
     * The callback of the command. 
     * @type {RunFunction} 
     */
    run;
    /** 
     * The category of the command. 
     * @type {string} 
     */
    category;

    /**
     * @param {CommandOptions} options
     */
    constructor(options) {
        Object.assign(this, options);
        this.data = {
            type: ApplicationCommandType.Message,
            name: this.name,
            defaultMemberPermissions: this.permissions ?? null,
            dmPermission: !this.guildOnly
        }
    }
}