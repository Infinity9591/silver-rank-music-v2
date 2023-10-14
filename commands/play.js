const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource}= require('@discordjs/voice');
const ytdl = require('ytdl-core');
let queues = require('../modules/Queues.js');
const Queue = require('../modules/Queue.js');
const Song = require('../modules/Song.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music with Youtube link')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Fill Youtube link')
                .setRequired(true)
        ),
    async execute(interaction){
        try {
            await interaction.deferReply();
            let voiceChannel = interaction.member.voice.channel;
            module.exports.voiceChannel = voiceChannel;
            if (!voiceChannel) return interaction.followUp("Vào voice hoặc có cl tao bật nhạc cho nghe.");
            const url = interaction.options.getString('url');
            const connection = await joinVoiceChannel({
                channelId : interaction.member.voice.channel.id,
                guildId : interaction.member.voice.channel.guild.id,
                adapterCreator : interaction.member.voice.channel.guild.voiceAdapterCreator
            });
            module.exports.connection = connection;
            if (!ytdl.validateURL(url)) {
                return interaction.reply("Hỗ trợ link video Youtube thôi, gimme link video Youtube or bị đút đít");
            }
            else {
                let video = await ytdl.getInfo(url);
                const song = new Song(video.videoDetails.title, video.videoDetails.video_url);
                const embedPlay = new EmbedBuilder()
                    .setColor(0x00FFFF)
                    .setDescription(`:notes: Thêm vào hàng chờ: ${song.title}`)
                    .setThumbnail('https://pbs.twimg.com/media/FZ1oM4MX0AE0jbA?format=jpg&name=900x900')
                    .setTimestamp(new Date())
                    .setFooter({
                        text: 'Create by Infinity9591 with GitHub Source',
                        iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
                    });
                let serverQueue = queues.get(interaction.guild.id);
                module.exports.serverQueue = serverQueue;
                let queue = new Queue(voiceChannel);
                module.exports.queue = queue;
                if (!serverQueue || serverQueue.songs.length === 0) {
                    queues.set(interaction.guild.id, queue);
                    queue.songs.push(song);
                    queue.connection = connection;
                    queue.playing = true;
                    await playSong(interaction);
                }
                else {
                    serverQueue.songs.push(song);
                    await interaction.followUp({embeds: [embedPlay]});
                }
            }
        }
        catch (err){
            console.log(err);
            return interaction.followUp("Lmao có lỗi kết nối rồi");
        }
    }
}

let playSong = async function(interaction){
    let serverQueue = queues.get(interaction.guild.id);
    const player = createAudioPlayer();
    if (!serverQueue) return;
    if (serverQueue.songs.length < 1) {
        interaction.channel.send("Hết nhạc rồi.");
    } else {
        let song = serverQueue.songs[0];
        const stream = ytdl(song.url, {filter: 'audioonly', highWaterMark: 1<<25, type: 'opus', quality : 'highest'});
        module.exports.player = player;
        const embed = new EmbedBuilder()
            .setColor(0x00FFFF)
            .setDescription(`:notes: Bắt đầu phát: ${song.title}`)
            .setThumbnail('https://pbs.twimg.com/media/FZ1oM4MX0AE0jbA?format=jpg&name=900x900')
            .setTimestamp(new Date())
            .setFooter({
                text: 'Create by Infinity9591 with GitHub Source',
                iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        const resource = createAudioResource(stream);
        player.play(resource);
        serverQueue.connection.subscribe(player);
        player.once('idle', async ()=>{
            if (!serverQueue.repeat) {
                serverQueue.songs.shift();
            }
            await playSong(interaction);
        });
        player.once('playing', () => {
            interaction.channel.send({embeds : [embed]});
        });
    }
}
module.exports.playSong = async function(interaction){
    await playSong(interaction);
};
