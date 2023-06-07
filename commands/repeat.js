const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const play = require('../commands/play.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Repeat')
    , async execute(interaction){
        if (!play.serverQueue) return interaction.reply("=)))????");
        const embedRepeat = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setDescription(`:notes: Lặp lại bài: ${play.serverQueue.songs[0].title}`)
            .setTimestamp(new Date())
            .setFooter({
                text: 'Create by Infinity9591',
                iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        play.serverQueue.repeat = true;
        return interaction.reply({embeds : [embedRepeat]});
    }
}