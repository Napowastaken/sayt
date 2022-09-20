const Command = require("../../utils/classes/Command");
module.exports = new Command({
    
    name: 'ping',
    description: 'ping',
    
    run(interaction, client) {
        let resp;
        if (client.ws.ping < 50) resp = ':rocket:';
        else if (client.ws.ping < 100) resp = ':fire:';
        else if (client.ws.ping < 200) resp = ':smiley:';
        else if (client.ws.ping < 300) resp = ':sleeping_accommodation:';
        else if (client.ws.ping < 400) resp = ':crying_cat_face:'
        else if (client.ws.ping < 600) resp = ':turtle:';
        else resp = client.emotes.python;
        interaction.reply(`**Pong!** Bot latency is \`${client.ws.ping}ms\` ${resp}`);
    }
});