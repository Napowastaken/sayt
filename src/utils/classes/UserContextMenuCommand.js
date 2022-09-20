const { UserContextMenuCommandInteraction, PermissionResolvable } = require('discord.js');
const Client = require('./Client');
/** @typedef {(interaction: UserContextMenuCommandInteraction, client: Client) => any} RunFunction */
/**
 * @typedef {object} UserContextMenuCommandOptions
 * @property {string} name The name of the command.
 * @property {RunFunction} run The callback of the command.
 * @property {PermissionResolvable[]} [permissions] Default permissions the interaction member must have
 * to execute the command. Keep in mind server administrators can change what permissions are needed,
 * this is just what it defaults to.
 * @property {PermissionResolvable[]} [clientPermissions] What permissions the client must have to execute
 * the command.
 * @property {boolean} [guildOnly] Whether this command can only be used in guilds and not DMs. Defaults to false.
 * @property {boolean} [ownerOnly] Whether this command can only be used by the owner of the bot. Defaults to false.
 * @property {boolean} [guildMember] Set to true if the user must be a member of the server.
 * @property {boolean} [notYourself] Set to true if the user cannot be the same as interaction user.
 * @property {boolean} [notClient] Set this to true if the user can't be the bot.
 * @property {boolean} [notGuildOwner] Set this to true if the user can't be the interaction server owner.
 * @property {boolean} [higherRole] Whether the interaction member must have a higher role than the
 * selected one. Defaults to false.
 * @property {boolean} [botHigherRole] Whether the client must have a higher role than the selected user.
 * Defaults to false.
 */

module.exports = class UserContextMenuCommand {
    /** @type {string} The command's name. */
    name;

    /** @type {RunFunction} The callback of the command. */
    run;

    /** @type {PermissionResolvable[] | undefined} The default member permissions for the command. */
    permissions;

    /** @type {PermissionResolvable[] | undefined} Permissions the client must have to execute the command. */
    clientPermissions;

    /** @type {boolean | undefined} Whether this command is only usable by the bot's developer. */
    ownerOnly;

    /** @type {boolean | undefined} Whether this command can only be used in guilds. */
    guildOnly;

    /** @type {boolean | undefined} Whether the selected user must be a member of the server. */
    guildMember;

    /** @type {boolean | undefined} Whether the selected user can be the same as interaction user. */
    notYourself;

    /** @type {boolean | undefined} Whether the selected user can't be the bot. */
    notClient;

    /** @type {boolean | undefined} Whether the selected user can't be the interaction server owner. */
    notGuildOwner;

    /** @type {boolean | undefined} Whether the interaction member must have a higher role than the selected one. */
    higherRole;

    /** @type {boolean | undefined} Whether the client must have a higher role than the selected member. */
    botHigherRole;

    /** @type {string} */
    category;

    /** @param {UserContextMenuCommandOptions} options */
    constructor(options) {
        Object.assign(this, options);
        this.data = {
            name: this.name,
            type: 2,
            defaultMemberPermissions: this.permissions,
            dmPermission: !this.guildOnly
        }
    }
}