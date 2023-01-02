const fs = require('fs');
/**
 * @template [V = any]
 */
module.exports = class Database {

    /**
     * @param {{
     * path: string;
     * indent?: number;
     * }} options
     * @template {Database<V>}
     */
    constructor({ path, indent }) {
        if (!path || typeof(path) != 'string') throw TypeError('Database path must be a non-empty string.');
        if (!path.endsWith('.json')) throw TypeError('Database path must be a valid .json file');
        if (indent && typeof(indent) != 'number') throw TypeError('Indentation must be a valid number.');
        /** @description The path to the file where data is stored. */
        this.path = path;

        /** @description Represents the indentation given to the constructor. 4 if not set. */
        this.indent = indent || 4;
        this.load();
    }

    /**
     * @description Loads the database's content.
     * 
     * **Note:** This module already loads for you, so you won't really need this unless it's a very specific case.
     */
    load() {
        /**
         * @type {object}
         * @description Represents all the content in the database.
        */
        this.content = JSON.parse(fs.readFileSync(this.path).toString());
    }

    /**
     * @description Save the database's content to the file.
     * 
     * **Note:** This module already saves for you, so you won't really need this unless it's a very specific case.
     */
    save() {
        let json;
        try { json = JSON.stringify(this.content, null, this.indent) } catch (err) { throw err; }
        fs.writeFileSync(this.path, json, "utf-8");
    }

    /**
     * @description Set a key to a specified value, or create one if it doesn't exist.
     * @param {string} key Name of the key.
     * @param {V} value Value of the key that will be set.
     */
    set(key, value) {
        if (typeof(key) != 'string') throw TypeError('Key must be a string.');
        this.load();
        this.content[key] = value;
        this.save();
    }

    /**
     * @description Get a key from the database.
     * @param {string} key Name of the key to get.
     * @returns {V}
     */
    get(key) {
        if (typeof(key) != 'string') throw TypeError('Key must be a string.');
        this.load();
        return this.content[key];
    }

    /**
     * @description Return a boolean indicating whether a key exists or not in the database.
     * @param {string} key Name of the key.
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) != undefined
    }

    /**
     * @description Delete any item from the database.
     * @param {string} key Name of the key to delete.
     */
    delete(key) {
        if (typeof(key) != 'string') throw TypeError('Key must be a string.');
        this.load();
        delete this.content[key];
        this.save();
    }

    /** @description Clears all the database. This cannot be undone, so be careful! */
    clear() {
        this.content = {}
        this.save();
    }

    /**
     * @description Get all keys from the database.
     * @returns {string[]}
     */
    keys() {
        return Object.keys(this.content);
    }

    /**
     * @description Get all values from the database.
     * @returns {V[]}
     */
    values() {
        return Object.values(this.content);
    }


    /**
     * @description Return a list of items whose value passes a test.
     * @param {(value: V) => boolean} statement The statement.
     * @returns {V[]}
     */
    filter(statement) {
        this.load();
        return this.values().filter(statement);
    }

    /**
     * @description Return the first item whose value passes a test.
     * @param {(item: V) => boolean} statement The statement.
     * @returns {V | undefined}
     */
    find(statement) {
        this.load();
        return this.values().find(statement);
    }

    /**
     * @description Pushes any item into a list, or create one if it doesn't exist or it's from another type.
     * @param {string} key Name of the key to push.
     * @param {any} value The value of the item.
     */
    push(key, value) {
        if (typeof(key) != 'string') throw TypeError('Key must be a string.');
        this.load();
        if (!Array.isArray(this.content[key])) this.content[key] = []
        this.content[key].push(value);
        this.save();
    }

    /**
     * @description Remove any item from a list.
     * @param {string} key Name of the key where the list is.
     * @param {number} index Index of the item to remove.
     */
    removeFromList(key, index) {
        const list = this.content[key];
        if (typeof(key) != 'string') throw TypeError('Key must be a string.');
        this.load();
        if (!Array.isArray(list)) throw TypeError('Value of the key must be a list.');
        if (list[index]) this.content[key].splice(index, 1);
        this.save();
    }

}