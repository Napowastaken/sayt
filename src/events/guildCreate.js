const Event = require("../utils/classes/Event");

module.exports = new Event({
    name: 'guildCreate',
    run(client) {
        require('./ready').run(client);
    }
});