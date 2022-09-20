const Event = require("../utils/classes/Event");
const start = Date.now();
module.exports = new Event({
    name: 'ready',
    
    run(client) {
        console.log(`Logged in! ${Date.now() - start}ms`);
    }
});