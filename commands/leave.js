const {SlashCommandBuilder} = require("discord.js");
const queues = require('../modules/Queues.js');
const play = require('../commands/play.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave channel'),
    async execute(interaction){
        if (!play.serverQueue) return;
        play.connection.destroy();
        queues.delete(interaction.guild.id);
        return interaction.reply("Cook đây");
    }
}