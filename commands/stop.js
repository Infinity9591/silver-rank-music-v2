const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const play = require('./play.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop music'),
    async execute(interaction){
        if (!play.serverQueue) return interaction.reply("Có bài chết liền!");
        play.serverQueue.songs = [];
        play.player.stop();
        await interaction.deferReply();
        const embedStop = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setDescription(`:notes: Đã tắt hết list rồi ehe.`)
            .setThumbnail('https://images3.alphacoders.com/120/1202656.jpg')
            .setTimestamp(new Date())
            .setFooter({
                text:'Create by Infinity9591',
                iconURL:'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        return interaction.followUp({embeds : [embedStop]})
    }
}