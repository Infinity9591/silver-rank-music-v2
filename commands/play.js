const {SlashCommandBuilder, EmbedBuilder, Client, IntentsBitField, StringSelectMenuBuilder, ActionRowBuilder,
    StringSelectMenuOptionBuilder
} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus}= require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const {getVideoInfo} = require('youtube-video-exists');
let queues = require('../modules/Queues.js');
const Queue = require('../modules/Queue.js');
const Song = require('../modules/Song.js');
const Intents = new IntentsBitField();
Intents.add(IntentsBitField.Flags.Guilds);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music with Youtube link')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Fill Youtube link')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Fill name of video')
                .setRequired(false)
        ),
    async execute(interaction){
        try {
            let voiceChannel = interaction.member.voice.channel;
            module.exports.voiceChannel = voiceChannel;
            if (!voiceChannel) return interaction.reply("Vào voice hoặc có cl tao bật nhạc cho nghe.");
            const url = interaction.options.getString('url') ?? "";
            const name = interaction.options.getString('name') ?? "";
            module.exports.name = name;
            const connection = await joinVoiceChannel({
                channelId : interaction.member.voice.channel.id,
                guildId : interaction.member.voice.channel.guild.id,
                adapterCreator : interaction.member.voice.channel.guild.voiceAdapterCreator
            });
            module.exports.connection = connection;
            if (url !== "" && name === ""){
                if (!ytdl.validateURL(url)) {
                    return interaction.reply("Hỗ trợ link video Youtube thôi, gimme link video Youtube or bị đút đít");
                }
                else {
                    let str = "";
                    for (let i=0; i<url.length-2; i++)
                    {
                        if (url[i] === 'v' && url[i+1] === '='){
                            for (let j=i+2; j<url.length; j++){
                                str+=url[j];
                            }
                        }
                    }
                    let check = getVideoInfo(str);
                    await interaction.deferReply();
                    if ((await check).existing){
                        let video = await ytdl.getInfo(url);
                        const song = new Song(video.videoDetails.title, video.videoDetails.video_url);
                        const embedPlay = new EmbedBuilder()
                            .setColor(0x00FFFF)
                            .setDescription(`:notes: Thêm vào hàng chờ: ${song.title}`)
                            .setThumbnail('https://pbs.twimg.com/media/FZ1oM4MX0AE0jbA?format=jpg&name=900x900')
                            .setTimestamp(new Date())
                            .setFooter({
                                text: 'Create by Infinity9591',
                                iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
                            });
                        let serverQueue = queues.get(interaction.guild.id);
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
                    } else return interaction.reply("Gõ lại url hoặc tao sút đít.");
                }
            }
            else if (name !== "" && url === ""){
                const filters1 = await ytsr.getFilters(name);
                const filters = filters1.get('Type').get('Video');
                let menu = new ActionRowBuilder();
                await interaction.deferReply();
                let list = [];
                await ytsr(filters.url, {limit : 5}).then(async query => {
                    for (let i = 0; i < query.items.length; i++) {
                        list.push({
                            name : String(query.items[i].title),
                            url : String(query.items[i].url),
                            value : `${i}`
                        })
                    }
                    module.exports.list = list;
                    const embedList = new EmbedBuilder()
                        .setColor(0x00FFFF)
                        .setDescription(`:notes: Danh sách bài hát:\n1.${list[0].name}\n2.${list[1].name}\n3.${list[2].name}\n4.${list[3].name}\n5.${list[4].name}\n`)
                        .setThumbnail('https://pbs.twimg.com/media/FZ1oM4MX0AE0jbA?format=jpg&name=900x900')
                        .setTimestamp(new Date())
                        .setFooter({
                            text: 'Create by Infinity9591',
                            iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
                        });
                    menu.addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('music-select')
                            .setPlaceholder('Choose Music')
                            .addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(`1.${list[0].name}`)
                                    .setValue('0'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(`2.${list[1].name}`)
                                    .setValue('1'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(`3.${list[2].name}`)
                                    .setValue('2'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(`4.${list[3].name}`)
                                    .setValue('3'),
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(`5.${list[4].name}`)
                                    .setValue('4'),
                            )
                    );
                    await interaction.followUp({embeds : [embedList], components : [menu]});
                });
            }
        }
        catch (err){
            console.log(err);
            return interaction.followUp("Lmao có lỗi kết nối rồi");
        }
    }
}

let playSong;
playSong = async function(interaction){
    let serverQueue = queues.get(interaction.guild.id);
    module.exports.serverQueue = serverQueue;
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
                text: 'Create by Infinity9591  ',
                iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
            });
        const resource = createAudioResource(stream);
        player.play(resource);
        serverQueue.connection.subscribe(player);
        player.once('idle', ()=>{
            if (!serverQueue.repeat) {
                serverQueue.songs.shift();
            }
            playSong(interaction);
        });
        player.once('playing', () => {
            interaction.channel.send({embeds : [embed]});
        });
    }
}
module.exports.playSong = async function(interaction){
    await playSong(interaction);
};
