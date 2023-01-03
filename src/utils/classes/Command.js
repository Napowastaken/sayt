const Client = require('./Client.js');
const { 
    ChatInputCommandInteraction,
    PermissionResolvable,
    ApplicationCommandOptionType,
    ChannelType,
    AutocompleteInteraction,
    PermissionFlagsBits
} = require('discord.js');
/** @typedef {(interaction: ChatInputCommandInteraction, client: Client) => any} RunFunction */

/** 
 * @typedef {object} CommandOptionsOption
 * @property {string} name The name of this option.
 * @property {string} description The description of this options.
 * @property {keyof typeof ApplicationCommandOptionType} type The type of the option.
 * @property {{ name: string, value: string }[]} [choices] If it's a string, number, or integer option,
 * the choices that can will show up so the user can select. (Being the only valid values)
 * @property {CommandOptionsOption[]} [options] If it's a Subcommand or SubcommandGroup option, what
 * options are own to that subcommand.
 * @property {string[] | (interaction: AutocompleteInteraction, client: Client) => string[]} autocomplete
 * The autocomplete choices of the command.
 * @property {boolean} [required] Whether this command is required. Defaults to false.
 * @property {number} [minValue] If it's a Number or Integer option, what is the minimum value the user can input.
 * @property {number} [maxValue] If it's a Number or Integer option, what is the maximum value the user can input.
 * @property {number} [minLength] If it's a String option, what is the minimum length the text must have.
 * @property {number} [maxLength] If it's a String option, what is the maximum length the text must have.
 * @property {(keyof typeof ChannelType)[]} [channelTypes] If it's a Channel option, what types of channels can be selected.
 * @property {PermissionResolvable[]} [clientPermissions] If it's a Channel option, what permissions the
 * client must have in that channel. If none is selected, this always defaults to interaction channel.
 * @property {boolean} [guildMember] If it's an User option, whether the user must be a member of the server.
 * Defaults to false.
 * @property {boolean} [notYourself] If it's an User option, you can set this to true so the user
 * can't select themselves.
 * @property {boolean} [notClient] If it's an User option, you can set this to true so the user
 * can't select the bot.
 * @property {boolean} [notGuildOwner] If it's an User option, you can set this to true so the user
 * can't select the interaction server owner.
 * @property {boolean} [higherRole] If it's an User option, whether the interaction member must have
 * a higher role than the selected one. Defaults to false.
 * @property {boolean} [botHigherRole] If it's an User option, whether the client must have a higher
 * role than the selected user. Defaults to false.
 * @property {boolean} [higher] If it's a Role option, whether the interaction member's highest role
 * must be higher than the selected role. Defaults to false.
 * @property {boolean} [higherFromBot] If it's a Role option, whether the client's highest role must be
 * higher than the selected role. Defaults to false.
 * @property {boolean} [notIntegrated] If it's a Role option, you can set this to true so the selected
 * role mustn't be managed by an integration.
 * @property {boolean} [canvas] if it's an Attachment option, set this to true so the format of the file will
 * be validated to be supported by canvas.
 */

/**
 * @typedef {object} CommandOptions
 * @property {string} name The name of the command.
 * @property {string} description The description of the command.
 * @property {PermissionResolvable[]} [permissions] Default permissions the interaction member must have
 * to execute the command. Keep in mind server administrators can change what permissions are needed,
 * this is just what it defaults to.
 * @property {PermissionResolvable[]} [clientPermissions] What permissions the client must have to execute
 * the command.
 * @property {boolean} [guildOnly] Whether this command can only be used in guilds and not DMs. Defaults to false.
 * @property {boolean} [ownerOnly] Whether this command can only be used by the owner of the bot. Defaults to false.
 * @property {CommandOptionsOption[]} [options] The options of this command.
 * @property {RunFunction} run The callback of the command.
 */

module.exports = class Command {

    /** The name of the command. */
    name = '';
    /** The description of the command. */
    description = '';
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
    /** Whether this command can only be used in guilds. */
    guildOnly = false;
    /** Whether this command can only be used by the owner of the bot. */
    ownerOnly = false;
    /**
     * The options of the command.
     * @type {CommandOptionsOption[] | undefined}
     */
    options;
    /** 
     * The callback of the command. 
     * @type {RunFunction} 
     */
    run;
    /** The category of the command. */
    category = '';

    /**
     * @param {CommandOptions} options
     */
    constructor(options) {
        Object.assign(this, options);
        this.data = {
            name: this.name,
            description: this.description,
            defaultMemberPermissions: this.permissions ?? null,
            dmPermission: !this.guildOnly,
            options: this.options?.map(o => this.#transformOption(o))
        }
    }
    /** @param {CommandOptionsOption} o */
    #transformOption(o) {
        return {
            ...o,
            autocomplete: !!o.autocomplete,
            type: ApplicationCommandOptionType[o.type],
            channelTypes: o.channelTypes?.map(c => ChannelType[c]),
            options: o.options?.map(option => this.#transformOption(option))
        }
    }
}