const { Events, EmbedBuilder} = require('discord.js');
const ytdl = require("ytdl-core");
const Song = require("../modules/Song");
const queues = require("../modules/Queues");
const Queue = require("../modules/Queue");
const play = require("../commands/play.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()){
            if (!interaction.isChatInputCommand()) return;

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }
        else if (interaction.isStringSelectMenu()){
            if (interaction.customId === "music-select"){
                await interaction.deferReply();
                let index = '';
                await interaction.values.forEach(value => {
                    index += `${value}`;
                });
                let video = await ytdl.getInfo(play.list[index].url);
                const song1 = new Song(video.videoDetails.title, video.videoDetails.video_url);
                const embedPlay = new EmbedBuilder()
                    .setColor(0x00FFFF)
                    .setDescription(`:notes: Thêm vào hàng chờ: ${song1.title}`)
                    .setThumbnail('https://pbs.twimg.com/media/FZ1oM4MX0AE0jbA?format=jpg&name=900x900')
                    .setTimestamp(new Date())
                    .setFooter({
                        text: 'Create by Infinity9591  ',
                        iconURL: 'https://static.tvtropes.org/pmwiki/pub/images/genshin_memetic.jpg'
                    });
                let serverQueue = queues.get(interaction.guild.id);
                let queue = new Queue(play.voiceChannel);
                if (!serverQueue || serverQueue.songs.length === 0) {
                    queues.set(interaction.guild.id, queue);
                    queue.songs.push(song1);
                    queue.connection = play.connection;
                    queue.playing = true;
                    await play.playSong(interaction);
                }
                else {
                    serverQueue.songs.push(song1);
                    await interaction.followUp({embeds: [embedPlay]});
                }
            }
        }
    },
};