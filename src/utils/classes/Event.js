const { ClientEvents } = require('discord.js');
const Client = require('./Client');
/**
 * @template {keyof ClientEvents} key
 * @typedef {{
 * name: key
 * run: (client: Client, ...args: ClientEvents[key]) => any
 * }} EventOptions<key extends keyof ClientEvents>
 */

/** @template {keyof ClientEvents} key */
module.exports = class Event {
    /** @type {EventOptions<key>['name']} */
    name;

    /** @type {EventOptions<key>['run']} */
    run;

    /** @param {EventOptions<key>} options */
    constructor(options) {
        Object.assign(this, options);
    }
}