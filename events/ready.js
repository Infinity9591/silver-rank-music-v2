const {Events, ActivityType} = require('discord.js')

module.exports = {
    name : Events.ClientReady,
    once : true,
    execute(client){
        client.user.setStatus("ONLINE");
        client.user.setPresence({
            activities: [{ name: `/help`, type: ActivityType.Listening }],
            status: 'online',
        });
        console.log(`Ready! Logged in as ${client.user.tag}`)
    }
}