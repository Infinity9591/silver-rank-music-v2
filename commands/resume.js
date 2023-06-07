const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const play = require('../commands/play.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume music')
    , async execute(interaction){
        if (!play.serverQueue) return interaction.reply("AĐ MÚIC PLEÁE. =))))") ;
        const embedResume = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setDescription(`Đã bật lại ${play.serverQueue.songs[0].title}`)
            .setThumbnail('https://w0.peakpx.com/wallpaper/190/346/HD-wallpaper-jett-in-purple-dress-valorant.jpg')
            .setTimestamp(new Date())
            .setFooter({
                text: 'Create by Infinity9591',
                iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        play.player.unpause();
        play.queue.playing = true;
        return interaction.reply({ embeds: [embedResume] });
    }
}