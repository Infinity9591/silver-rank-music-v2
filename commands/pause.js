const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const play = require('../commands/play.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause music')
    , async execute(interaction){
        if (!play.serverQueue) return interaction.reply("Thêm bài!");
        const embedPause = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setDescription(`:notes: Đã tạm dừng ${play.serverQueue.songs[0].title}`)
            .setThumbnail('https://images8.alphacoders.com/114/thumb-1920-1149389.jpg')
            .setTimestamp(new Date())
            .setFooter({
                text: 'Create by Infinity9591',
                iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        play.player.pause();
        play.queue.playing = false;
        return interaction.reply({ embeds: [embedPause] });
    }
}