const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data : new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help'),
    async execute(interaction){
        const embedHelp = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setTitle('List lệnh:')
            .setDescription('\n/help: Bảng lệnh\n/ping: Check độ trễ\n/play + url: Chơi nhạc\n/stop: Dừng nhạc\n/skip: Bỏ qua bài nhac\n/pause: Tạm dừng nhạc\n/resume: Tiếp tục phát nhạc\n/repeat: Bật lặp lại\n/offrepeat: Tắt lặp lại\n/queue: List nhạc dang chờ\n/leave : Rời kênh voice')
            .setThumbnail('https://wallpapercave.com/wp/wp6438243.jpg')
            .setTimestamp(new Date())
            .setFooter({
                text:'Create by Infinity9591',
                iconURL:'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        return interaction.reply({embeds : [embedHelp]})
    }
}