const Event = require("../utils/classes/Event");
const Infraction = require("../utils/classes/Infraction");
module.exports = new Event({
    name: 'guildMemberInfractionAdd',
    
    /** @param {Infraction} infraction */
    async run(client, infraction, syncCallback) {
        const types = {
            warning: 'warned',
            kick: 'kicked',
            ban: 'banned',
            timeout: `timed out for ${infraction.stringDuration}`
        }
        
        let dms = client.dms.get(infraction.guild.id);
        if (dms && dms.includes(infraction.type) && !infraction.user.bot) { 
            await infraction.user.send(`You have been **${types[infraction.type]}** in \`${client.escTicks(infraction.guild.name)} (${infraction.guild.id})\`
\`\`\`${client.escTicks(infraction.reason || 'No reason provided.')}\`\`\``).catch(() => { 
                setTimeout(async () =>
                infraction.interaction?.followUp(`:warning: I couldn't DM **${client.escMD(infraction.user.tag)}** as they seem to have closed DMs, or I don't share a server with them.`),
                3000);
            });
        }
        if (syncCallback) await syncCallback();
    }
});