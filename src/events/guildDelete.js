const Event = require("../utils/classes/Event");

module.exports = new Event({
    name: 'guildDelete',
    run(client) {
        require('./ready').run(client);
    }
});