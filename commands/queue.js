const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const play = require('../commands/play.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Queue'),
    async execute(interaction){
        if (!play.serverQueue) return interaction.reply("List trống như lượng người yêu mày có vậy.");
        let result = play.serverQueue.songs.map((song, i) => {
            return `${(i === 0) ? `\`Đang phát:\`` : `${i}.`} ${song.title}`
        }).join('\n');
        await interaction.deferReply();
        const embedQueue = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setDescription(`${result}`)
            .setThumbnail('https://preview.redd.it/i8udri6j1xg81.png?width=1655&format=png&auto=webp&s=b60ac989a849a1a33b57e0db69707516614f062e')
            .setTimestamp(new Date())
            .setFooter({
                text:'Create by Infinity9591',
                iconURL:'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        return interaction.followUp({embeds : [embedQueue]})
    }
}