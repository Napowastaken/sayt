if (require('fs').existsSync('./node_modules/dotenv')) require('dotenv').config();
const Client = require('./utils/classes/Client.js');
new Client().start();
process.on('uncaughtException', err => console.log(err));