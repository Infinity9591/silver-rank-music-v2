const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const play = require('../commands/play.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip'),
    async execute(interaction){
        if (!play.serverQueue) return interaction.reply("Thêm bài hát hoặc tao sủi.");
        await interaction.deferReply();
        const embedSkip = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setDescription(`:notes: Bỏ qua bài: ${play.serverQueue.songs[0].title}`)
            .setThumbnail('https://i.ytimg.com/vi/tomyYkKEC3U/maxresdefault.jpg')
            .setTimestamp(new Date())
            .setFooter({
                text:'Create by Infinity9591',
                iconURL:'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        if (play.serverQueue.songs.length === 1 ){
            play.serverQueue.songs = [];
            play.player.stop();
            await interaction.followUp({embeds : [embedSkip]})
        }
        else {
            play.serverQueue.songs.shift();
            await interaction.followUp({embeds : [embedSkip]})
            await play.playSong(interaction);
        }
    }
}